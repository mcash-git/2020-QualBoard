import { HttpClient } from 'aurelia-fetch-client';
import { CurrentUser } from 'shared/current-user';
import { RecentItems } from 'shared/recent-items';
import { MediaConfig } from '2020-media';
import { IdentityConfig } from '2020-identity';
import { MessagingConfig } from '2020-messaging';
import { AnalyticsConfig } from '2020-analytics';
import { AnnotationsConfig, AnnotationsClient } from '2020-annotations';
import { ServerEventClient } from '2020-servereventclient';
import { ParentViewState } from 'shared/app-state/parent-view-state';
import { ChildViewState } from 'shared/app-state/child-view-state';
import { SafeStack } from 'shared/components/safe-stack';
import { OidcWrapper } from 'shared/auth/oidc-wrapper';
import { participantStore } from 'participant/state/participant-store';
import configureStore from 'researcher/state/configure-store';
import { receiveCurrentUser, receiveAppConfig } from 'participant/state/actions/all';
import { actions } from 'researcher/state/all-actions';
import { getConfiguredParticipantSseClient } from 'participant/get-configured-participant-sse-client';
import { getConfiguredResearcherSseClient } from 'researcher/get-configured-researcher-sse-client';
import { setOlarkUserInfo } from 'shared/utility/set-olark-user-info';
import { Api } from './api/api';

export async function configureContainer(container, authManager) {
  const { oidcWrapper } = authManager;
  const { appConfig } = authManager;

  container.registerInstance(OidcWrapper, oidcWrapper);
  const currentUser = await oidcWrapper.getUser();
  const currentUserModel = new CurrentUser(currentUser);
  container.registerInstance(CurrentUser, currentUserModel);
  setOlarkUserInfo(currentUserModel);

  const httpClients = [];
  oidcWrapper.addAccessTokenUpdatedHandler((accessToken) => {
    httpClients.forEach((httpClient) => {
      configureHttpClient(httpClient, accessToken, httpClient.baseUrl);
    });
  });

  // NOTE: this instance of CurrentUser is being mutated when the user modifies their profile.
  // that is not kosher, but I'm not going to fix it right now as I try to make progress on the
  // task at hand.
  participantStore.dispatch(receiveAppConfig(appConfig));
  participantStore.dispatch(receiveCurrentUser(currentUserModel));

  const apiHttpClientHandler = () => {
    const httpClient = new HttpClient();
    configureHttpClient(httpClient, oidcWrapper.accessToken, appConfig.api.url);
    httpClients.push(httpClient);

    return httpClient;
  };

  container.registerHandler('QbApiHttpClient', apiHttpClientHandler);

  container.registerSingleton(RecentItems);

  // TODO:  At some point, the access_token is going to be changing during
  // active sessions (or it should I believe) - we will need to make sure
  // when that happens, all the dependent clients receive the new one.

  const mediaConfigHandler = () => new MediaConfig(Object.assign(
    { accessToken: () => oidcWrapper.accessToken },
    appConfig.media,
  ));

  container.registerHandler(MediaConfig, mediaConfigHandler);

  const messagingConfigHandler = () => new MessagingConfig(Object.assign(
    { accessToken: () => oidcWrapper.accessToken },
    appConfig.messaging,
  ));

  container.registerHandler(MessagingConfig, messagingConfigHandler);

  const analyticsConfigHandler = () => new AnalyticsConfig(Object.assign(
    { accessToken: () => oidcWrapper.accessToken },
    appConfig.analytics,
  ));

  container.registerHandler(AnalyticsConfig, analyticsConfigHandler);

  const annotationsConfigHandler = () => new AnnotationsConfig({
    ...appConfig.annotations,
    accessToken: () => oidcWrapper.accessToken,
  });

  container.registerHandler(AnnotationsConfig, annotationsConfigHandler);

  const identityConfigHandler = () => new IdentityConfig({
    accessToken: () => oidcWrapper.accessToken,
    baseUrl: appConfig.identity.baseUrl,
  });

  container.registerHandler(IdentityConfig, identityConfigHandler);

  const parentStateStack = new SafeStack(ParentViewState);
  container.registerInstance('ParentStateStack', parentStateStack);

  const childStateStack = new SafeStack(ChildViewState);
  container.registerInstance('ChildStateStack', childStateStack);

  const researcherStore = configureStore({
    api: container.get(Api),
    annotationsClient: container.get(AnnotationsClient),
  });

  researcherStore.dispatch(actions.appConfig.set(appConfig));
  researcherStore.dispatch(actions.currentUser.set(currentUser));

  container.registerInstance('store', researcherStore);

  try {
    const eventClient = new ServerEventClient();
    eventClient.configure({
      baseUrl: appConfig.api.baseUrl,
      streamPath: 'api/event-stream',
    });
    eventClient.getAuthToken = () => oidcWrapper.accessToken;
    await eventClient.start();

    const participantEventClient =
      await getConfiguredParticipantSseClient(eventClient);
    const researcherEventClient =
      await getConfiguredResearcherSseClient(eventClient, researcherStore);

    container.registerInstance('ParticipantEventClient', participantEventClient);
    container.registerInstance('ResearcherEventClient', researcherEventClient);
  } catch (e) {
    console.warn('SSEs are not supported in this Browser:', e);
  }
}

function configureHttpClient(httpClient, accessToken, baseUrl) {
  httpClient.configure((config) => {
    config.withDefaults({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        /* eslint-disable quote-props */
        'Authorization': `Bearer ${accessToken}`,
        /* eslint-disable quote-props */
      },
    }).withBaseUrl(baseUrl);
  });
}

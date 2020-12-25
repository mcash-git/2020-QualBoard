export class ParentViewState {
  constructor({
    title = '',
    titleIcon = null,
    subtitle = null,
    navItems = [],
    statItems = [],
    backButtonRoute = null,
    shouldShowContentHeader = true,
    isParticipantRoute = false,
    isResearcherRoute = false,
  } = {}) {
    this.title = title;
    this.titleIcon = titleIcon;
    this.subtitle = subtitle;
    this.navItems = navItems;
    this.statItems = statItems;
    this.backButtonRoute = backButtonRoute;
    this.shouldShowContentHeader = shouldShowContentHeader;
    this.isParticipantRoute = isParticipantRoute;
    this.isResearcherRoute = isResearcherRoute;
  }
}

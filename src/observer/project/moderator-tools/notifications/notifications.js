import moment from 'moment';
import { CssHelper } from 'shared/css-helper';
import { NotificationCardModel } from 'researcher/project/moderator-tools/notifications/card/notification-card-model';
import { Router } from 'aurelia-router';
import { MessagingClient } from '2020-messaging';
import { EventAggregator } from 'aurelia-event-aggregator';

export class Notifications {
  static inject = [CssHelper, Router, MessagingClient, EventAggregator];

  constructor(cssHelper, router, messaging, eventAggregator) {
    this.cssHelper = cssHelper;
    this.router = router;
    this.messaging = messaging;
    this.ea = eventAggregator;

    this.notices = [];
    this.isProcessing = false;
    this.selected = null;
    this.appliedFilters = {};
    this.unreadCounts = {};
    this.newData = [];
  }

  canActivate() {
    this.fetch();
  }

  attached() {
    this.fetchSub = this.ea.subscribe('fetch-notifications', async () => {
      // spinner start
      this.isProcessing = true;

      // safely set all things back to empty
      this.notices = {};
      this.noticeCards = [];
      this.newData = [];

      await this.fetch();
      // spinner end
      this.isProcessing = false;
    });

    setInterval(this.fetch.bind(this), 30000);

    // open close stuff
    const noteSectionTitles = document.querySelectorAll('.notification-section-title');
    for (let i = 0; i < noteSectionTitles.length; ++i) {
      const noteSectionTitleList = noteSectionTitles[i];
      noteSectionTitleList.addEventListener('click', function () {
        const noteSectionTitleArrow = this.querySelector('.notification-arrow-toggle');
        if (noteSectionTitleArrow.classList.contains('icon-ion-chevron-up')) {
          noteSectionTitleArrow.classList.remove('icon-ion-chevron-up');
          noteSectionTitleArrow.classList.add('icon-ion-chevron-down');
        } else {
          noteSectionTitleArrow.classList.remove('icon-ion-chevron-down');
          noteSectionTitleArrow.classList.add('icon-ion-chevron-up');
        }
      });
    }
  }

  checkInterval(notices) {
    const intervals = {
      today: { unreadCount: 0, isVisible: false },
      yesterday: { unreadCount: 0, isVisible: false },
      thisWeek: { unreadCount: 0, isVisible: false },
      older: { unreadCount: 0, isVisible: false },
    };

    const today = moment();
    const yesterday = moment().subtract(1, 'day');

    notices.items.forEach(n => {
      // today / yesterday / week / older
      if (n.createdDate) {
        if (moment(n.createdDate).isSame(today, 'day')) {
          if (!n.isRead) {
            intervals.today.unreadCount += 1;
          }
          n.isToday = true;
          intervals.today.isVisible = true;
        } else if (moment(n.createdDate).isSame(yesterday, 'day')) {
          if (!n.isRead) {
            intervals.yesterday.unreadCount += 1;
          }
          n.isYesterday = true;
          intervals.yesterday.isVisible = true;
        } else if (moment(n.createdDate).isSame(today, 'week')) {
          if (!n.isRead) {
            intervals.thisWeek.unreadCount += 1;
          }
          n.isWeek = true;
          intervals.thisWeek.isVisible = true;
        } else {
          if (!n.isRead) {
            intervals.older.unreadCount += 1;
          }
          n.isOlder = true;
          intervals.older.isVisible = true;
        }
      }
    });
    notices.intervals = intervals;
    return notices;
  }

  async fetch() {
    const filters = await this.appliedFilters;
    let prefix = null;

    if (filters.group.projectId) {
      prefix = `tt://projects/${filters.group.projectId}`;

      if (filters.group.iaId) {
        prefix += `/events/${filters.group.iaId}`;
      }
    }

    const results = await this.messaging.notifications.get({
      type: filters.checked.map(f => f.value),
      hideRead: filters.hideRead,
      search: filters.search,
      prefix,
    });

    // combine the old data (this.notices) with new data (results)
    await this.combineData(results);

    // figure out the time increments
    if (this.notices.items) {
      this.notices = this.checkInterval(this.notices);
    }

    // map the notices to the card model
    await this.createNoticeCards();

    return true;
  }

  createNoticeCards() {
    if (this.noticeCards && this.newData.length > 0) {
      this.notices.items.forEach(n => {
        if (n.isNew) {
          this.noticeCards.push(new NotificationCardModel(n));
          n.isNew = false;
        }
      });
    } else {
      this.noticeCards = this.notices.items.map(n => new NotificationCardModel(n));
    }
  }

  async combineData(data) {
    await this.findNewData(data);

    if (this.notices.items && this.notices.items.length > 0 && this.newData.length > 0) {
      this.notices.items = this.notices.items.concat(this.newData);
    } else {
      this.notices = data;
    }

    // also need to make sure selected doesn't already exist
    if (this.selected) {
      const found = this.notices.items.find(item => item.id === this.selected.id);
      if (!found) {
        if ((this.notices.projectId && this.selected.projectId === this.notices.projectId)
          || (this.notices.eventId && this.selected.eventId === this.notices.eventId)
          || (!this.notices.eventId && this.notices.projectId)) {
          this.notices.items.push(this.selected);
        }
      }
    }
  }

  findNewData(data) {
    this.newData = [];
    data.items.filter(d => {
      if (this.notices.items && this.notices.items.length) {
        let dupe = false;

        this.notices.items.forEach(n => {
          // if it is same id as the new data we just fetched and the read
          // status hasn't changed it's a dupe and not newData.
          if (n.id === d.id && n.isRead === d.isRead) {
            dupe = true;
          }
        });

        if (!dupe) {
          d.isNew = true;
          this.newData.push(d);
        }
      }
      return true;
    });
    return this.newData;
  }

  handleSelect(target, n) {
    n.isSelected = true;

    this.selected = n;
    this.ea.publish('fetch-unread-counts');
    this.navigateToSelectedUrl(n);
    this.markRead(n);
    this.fadeReadNotice(n);
  }

  fadeReadNotice(notice) {
    if (this.appliedFilters.hideRead) {
      // we need to loop through and remove the notification after as set time
      setTimeout(() => {
        notice.isSelected = false;
        this.selected = null;
        this.noticeCards = this.noticeCards.filter((card) => card.id !== notice.id);
        this.notices.items = this.notices.items.filter((item) => item.id !== notice.id);
        this.fetch();
      }, 5000);
    } else {
      this.selected = null;
    }
  }

  navigateToSelectedUrl(notice) {
    if (notice.url.charAt(0) === '/') {
      notice.url = notice.url.slice(1);
    }
    this.router.navigate(notice.url);
  }

  async markRead(notice) {
    if (!notice.isRead) {
      await this.messaging.notifications.dismiss(notice.id);
      notice.isRead = true;
    }
    this.notices.items.find(item => item.id === notice.id).isRead = true;
  }

  detached() {
    this.fetchSub.dispose();
  }
}

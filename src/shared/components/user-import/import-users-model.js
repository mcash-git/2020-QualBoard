import { FieldMap } from '2020-aurelia-bulk-import';
import { enums } from '2020-qb4';
import * as validate from 'validator';

const ProjectRoles = enums.projectRoles;

export class ImportUsersModel {
  constructor({
    groupTags = [],
  } = {}) {
    this.groupTags = groupTags;

    this.clean();
    this.fieldMaps = this._getFieldMaps();
  }

  clean() {
    this.newTags = [];
    this.groupTagLookup = this.groupTags.reduce((lookup, groupTag) => {
      lookup[groupTag.name.toLowerCase()] = groupTag;
      return lookup;
    }, {});
  }
  
  _getFieldMaps() {
    const validateRoleField = value => {
      const regexes = [
        /participant/i,
        /moderator/i,
        /researchanalyst/i,
        /clientobserver/i,
      ];
      return testRegexes(regexes, value);
    };
    const validateEmail = value => validate.isEmail(value);
    return [
      new FieldMap({
        displayName: 'User Level',
        property: 'role',
        convert: getRole,
        headerAutoDetect: value => {
          const regexes = [/user\s*level/i, /(user)?role/i, /(user)?type/i];
          return testRegexes(regexes, value);
        },
        validate: validateRoleField,
        contentAutoDetect: validateRoleField,
      }),
      new FieldMap({
        displayName: 'Email',
        property: 'email',
        isUnique: true,
        headerAutoDetect: value => {
          const regexes = [/e-?mail/i];
          return testRegexes(regexes, value);
        },
        contentAutoDetect: validateEmail,
        validate: validateEmail,
      }),
      new FieldMap({
        displayName: 'First Name',
        property: 'firstName',
        isRequired: false,
        headerAutoDetect: value => {
          const regexes = [/^first/i, /^given/i, /^f.*name/i];
          return testRegexes(regexes, value);
        },
      }),
      new FieldMap({
        displayName: 'Last Name',
        property: 'lastName',
        isRequired: false,
        headerAutoDetect: value => {
          const regexes = [/^last/i, /^surname/i, /^l.*name/i];
          return testRegexes(regexes, value);
        },
      }),
      new FieldMap({
        displayName: 'Display Name',
        property: 'displayName',
        isUnique: true,
        headerAutoDetect: value => {
          const regexes = [/user\s?name/i, /screen\s?name/i, /display\s?name/i];
          return testRegexes(regexes, value);
        },
      }),
      new FieldMap({
        displayName: 'Group Tags',
        property: 'groupTags',
        isRequired: false,
        convert: value => this._parseGroupTags(value),
        headerAutoDetect: value => {
          const regexes = [/group/i, /tags/i];
          return testRegexes(regexes, value);
        },
        contentAutoDetect: value => (value.match(/,/g) || []).length > 0,
      }),
    ];
  }

  _parseGroupTags(groupTagsText) {
    return groupTagsText.split(',')
      .reduce((tags, tagString) => {
        const trimmed = tagString.trim();
        const lower = trimmed.toLowerCase();
        if (lower) {
          if (!this.groupTagLookup[lower]) {
            const tag = { name: tagString.trim() };
            this.groupTagLookup[lower] = tag;
            this.newTags.push(tag);
          }
          tags.push(this.groupTagLookup[lower]);
        }
        return tags;
      }, []);
  }
}

const rolesLowerMap = ProjectRoles
  .reduce((lookup, role) => {
    lookup[role.value.toLowerCase()] = role.int;
    return lookup;
  }, {});

function getRole(roleText) {
  return rolesLowerMap[roleText.toLowerCase()];
}

function testRegexes(regexes, value) {
  return regexes.some(regex => regex.test(value));
}

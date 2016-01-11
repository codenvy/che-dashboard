/*
 * Copyright (c) 2015 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 */
'use strict';

/**
 * @ngdoc controller
 * @name team.directive:TeamMembersDialogAddCtrl
 * @description This class is handling the controller for account members
 * @author Ann Shumilova
 */
class TeamCtrl {

  /**
   * Default constructor that is using resource injection
   * @ngInject for Dependency injection
   */
  constructor (codenvyAPI, $mdMedia, $q, $mdDialog, codenvyNotification) {
    this.codenvyAPI = codenvyAPI;
    this.$mdMedia = $mdMedia;
    this.$q = $q;
    this.$mdDialog = $mdDialog;
    this.codenvyNotification = codenvyNotification;

    this.members = [];
    this.isLoading = true;

    if (this.codenvyAPI.getAccount().getAccounts().length > 0) {
      this.updateAccountData();
    } else {
      this.codenvyAPI.getAccount().fetchAccounts().then(() => {
        this.updateAccountData();
      });
    }
  }

  updateAccountData() {
    this.accounts = this.codenvyAPI.getAccount().getAccounts();
    this.account = this.accounts[0];
    this.getAccountMembers();
  }

  getAccountMembers() {
    this.codenvyAPI.getAccount().fetchAccountMembers(this.account.id).then(() => {
      this.members =  this.codenvyAPI.getAccount().getAccountMembers(this.account.id);
      this.updateMembers();
    });
  }

  updateMembers() {
    var promises = [];

    this.members.forEach((member) => {
      member.role = this.codenvyAPI.getUser().getDisplayRole(member.roles);

      let user = this.codenvyAPI.getUser().getUserFromId(member.userId);
      if (user) {
        member.email = user.email;
      } else {
        let userPromise = this.codenvyAPI.getUser().fetchUserId(member.userId);
        let updateUserPromise = userPromise.then(() => {
          member.email = this.codenvyAPI.getUser().getUserFromId(member.userId).email;
        });
        promises.push(updateUserPromise);
      }

      let profile = this.codenvyAPI.getProfile().getProfileFromId(member.userId);
      if (profile) {
        member.name = this.getFullName(profile);
      } else {
        let profilePromise = this.codenvyAPI.getProfile().fetchProfileId(member.userId);
        let updateProfilePromise = profilePromise.then(() => {
          member.name = this.getFullName(this.codenvyAPI.getProfile().getProfileFromId(member.userId));
        });
        promises.push(updateProfilePromise);
      }
    });

    this.$q.all(promises).then(() => {
      this.isLoading = false;
    });
  }

  /**
   * Gets the full name from a profile
   * @param profile the profile to analyze
   * @returns {string} a name
   */
  getFullName(profile) {
    var firstName = profile.attributes.firstName;
    if (!firstName) {
      firstName = '';
    }
    var lastName = profile.attributes.lastName;
    if (!lastName) {
      lastName = '';
    }

    return firstName + ' ' + lastName;
  }

  widthGtSm() {
    return this.$mdMedia('gt-sm');
  }

  /**
   * User clicked on the + button to add a new member. Show the dialog
   * @param $event
   */
  showAddMemberDialog($event) {
    this.$mdDialog.show({
      targetEvent: $event,
      controller: 'TeamMembersDialogAddCtrl',
      controllerAs: 'teamMembersDialogAddCtrl',
      bindToController: true,
      clickOutsideToClose: true,
      locals: { callbackController: this},
      templateUrl: 'app/navbar/team/team-members-dialog-add.html'
    });
  }

  /**
   * Callback by the dialog that is prompting for user to add
   * @param userEmailToAdd the user to add
   * @param roles the roles to add
   */
  callbackMemberAdd(email, roles) {
    let promiseGetUserByEmail = this.codenvyAPI.getUser().fetchUserByAlias(email);
    promiseGetUserByEmail.then(() => {
      var user = this.codenvyAPI.getUser().getUserByAlias(email);
      if (user) {
        this.addMember(user.id, roles);
      } else {
        this.codenvyNotification.showError('User with email: ' + email + ' not found.');
      }
    }, (error) => {
      this.codenvyNotification.showError(error.data.message ? error.data.message : '.');
    });
  }

  /**
   * Adds member by userId with pointed roles.
   * @param userId the user's id to add
   * @param roles the roles to add
   */
  addMember(userId, roles) {
    this.isLoading = true;
    let promise = this.codenvyAPI.getAccount().addAccountMember(this.account.id, userId, roles);
    promise.then(() => {
      this.codenvyAPI.getAccount().fetchAccountMembers(this.account.id).then(() => {
        this.members = this.codenvyAPI.getAccount().getAccountMembers(this.account.id);
        this.updateMembers();
      });
    }, (error) => {
      this.isLoading = false;
      let errorMessage = error.data.message ? error.data.message : 'Add team member failed.';
      errorMessage = errorMessage.replace(this.account.id, this.account.name);
      this.codenvyNotification.showError(errorMessage);
      console.log('error', error);
    });
  }

  removeMember(event, member) {
    var confirm = this.$mdDialog.confirm()
      .title('Would you like to remove member ' + member.email + ' from ' + this.account.name + '?')
      .content('Please confirm for the member removal.')
      .ariaLabel('Remove member')
      .ok('Remove')
      .cancel('Cancel')
      .clickOutsideToClose(true)
      .targetEvent(event);
    this.$mdDialog.show(confirm).then(() => {
      this.isLoading = true;
      let promise = this.codenvyAPI.getAccount().deleteAccountMember(this.account.id, member.userId);
      promise.then(() => {
        this.codenvyAPI.getAccount().fetchAccountMembers(this.account.id).then(() => {
          this.members = this.codenvyAPI.getAccount().getAccountMembers(this.account.id);
          this.updateMembers();
        });
      }, (error) => {
        this.isLoading = false;
        this.codenvyNotification.showError(error.data.message ? error.data.message : 'Delete team member failed.');
        console.log('error', error);
      });
    });
  }
}

export default TeamCtrl;

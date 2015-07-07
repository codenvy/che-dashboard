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

import Register from '../../utils/register';

/**
 * Defines a directive for creating select that are working either on desktop or on mobile devices.
 * It will change upon width of the screen
 * @author Oleksii Orel
 */
class CodenvySelect {

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor() {
    this.restrict = 'E';

    this.replace = true;
    this.transclude = true;
    this.templateUrl = 'components/widget/select/cdvy-select.html';

    // scope values
    this.scope = {
      value: '=cdvyValue',
      selectName: '@cdvyName',
      labelName: '@cdvyLabelName',
      placeHolder: '@cdvyPlaceHolder',
      size: '@cdvySize',
      myForm: '=cdvyForm',
      optionValues: '=cdvyOptionValues'
    };

  }


  compile(element, attrs) {

    var keys = Object.keys(attrs);

    // search the select field
    var selectElements = element.find('select');

    keys.forEach((key) => {

      // don't reapply internal properties
      if (key.indexOf('$') === 0) {
        return;
      }
      // don't reapply internal element properties
      if (key.indexOf('cdvy') === 0) {
        return;
      }
      // avoid model
      if (key.indexOf('ngModel') === 0) {
        return;
      }
      var value = attrs[key];

      // handle empty values as boolean
      if (value === '') {
        value = 'true';
      }

      // set the value of the attribute
      selectElements.attr(attrs.$attr[key], value);

      element.removeAttr(attrs.$attr[key]);

    });


  }


  /**
   * Keep reference to the model controller
   */
  link($scope, element) {
    // search the select field
    var selectElements = element.find('select');

    $scope.$watch('myForm.desk' + $scope.selectName + '.$pristine', (isPristine) => {
      if (isPristine) {
        element.addClass('desktop-pristine');
      } else {
        element.removeClass('desktop-pristine');
      }

      $scope.$watch('valueModel', (newVal) => {
        if (typeof newVal === 'undefined') {
          return;
        }

        $scope.value = newVal;
        $scope.hideOptions();

        angular.forEach(selectElements, function (selectElement) {
          selectElement.className = newVal === '' ? 'disabled' : '';
        });
      });

      let content = '';
      $scope.optionValues.forEach((optionValue) => {
        content += '<option  value=\'' + (optionValue.id ? optionValue.id : optionValue.name) + '\'>' + optionValue.name + '</option>';
      });

      // Append the value elements in the select element
      selectElements.append(content);

      angular.forEach(selectElements, function (selectElement) {
        selectElement.value = $scope.value;
      });

    });

    $scope.showOptions = function () {
      if ($scope.size && $scope.size > 0) {
        selectElements.attr('size', $scope.size);
      } else {
        // set default value
        selectElements.attr('size', 10);
      }
      selectElements.addClass('cdvy-select-border');
    };

    $scope.hideOptions = function () {
      selectElements.attr('size', 0);
      selectElements.removeClass('cdvy-select-border');
    };

  }

}

export default CodenvySelect;

Register.getInstance().directive('cdvySelect', CodenvySelect);

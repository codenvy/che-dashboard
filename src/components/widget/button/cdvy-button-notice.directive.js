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
import CodenvyButton from './cdvy-button.directive';

/**
 * @ngdoc directive
 * @name components.directive:cdvyButtonNotice
 * @restrict E
 * @function
 * @element
 *
 * @description
 * `<cdvy-button-notice>` defines a default button.
 *
 * @param {string=} cdvy-button-title the title of the button
 * @param {string=} cdvy-button-icon the optional icon of the button
 *
 * @usage
 *   <cdvy-button-notice cdvy-button-title="hello"></cdvy-button-notice>
 *
 * @example
 <example module="userDashboard">
 <file name="index.html">
 <cdvy-button-notice cdvy-button-title="Hello"></cdvy-button-notice>
 <cdvy-button-notice cdvy-button-title="Hello" cdvy-button-icon="fa fa-check-square"></cdvy-button-notice>
 </file>
 </example>
 * @author Florent Benoit
 */
class CodenvyButtonNotice extends CodenvyButton {

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor () {
    super();
  }


  /**
   * Template for the buttons
   */
  getTemplateStart() {
    return '<md-button md-theme=\"cdvynotice\" class=\"cdvy-button md-accent md-raised md-hue-2\"';
  }

}

export default CodenvyButtonNotice;

Register.getInstance().directive('cdvyButtonNotice', CodenvyButtonNotice);
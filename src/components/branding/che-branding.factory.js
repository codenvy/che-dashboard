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

import Register from '../utils/register.js';

/**
 * This class is handling the branding data in Che
 * @author Florent Benoit
 */
class CheBranding {

    /**
     * Default constructor that is using resource
     * @ngInject for Dependency injection
     */
    constructor(codenvyAPI, $http, $rootScope) {
        this.codenvyAPI = codenvyAPI;
        this.$http = $http;
        this.$rootScope = $rootScope;

        $http.get('/api/account').then(() => {
            this.updateData('codenvy');
        }, () => {
            this.updateData('che');
        });

    }

    updateData(mode) {

        let assetPrefix = 'assets/branding/' + mode + '/';

        // load data from the mode
        this.$http.get(assetPrefix + 'product.json').then((data) => {

            let brandingData = data.data;

            this.$rootScope.branding = {
                title: brandingData.title,
                name: brandingData.name,
                logoURL: assetPrefix + brandingData.logoFile,
                favicon : brandingData.favicon
            };


        });
    }

    getProductName() {
        return this.productName;
    }


    getProductLogo() {
        return this.productLogo;
    }



    getProductFavicon() {
        return this.productFavicon;
    }
}

// Register this factory
Register.getInstance().factory('cheBranding', CheBranding);
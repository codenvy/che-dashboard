'use strict';

describe('CodenvyWorkspace', function(){

  /**
   * Workspace Factory for the test
   */
  var factory;

  /**
   * Backend for handling http operations
   */
  var httpBackend;

  /**
   * Listener used for the tests
   */
  function Listener() {
    this.workspaces = [];
    this.onChangeWorkspaces = function (remoteWorkspaces) {
      this.workspaces = remoteWorkspaces;
    };
    this.getWorkspaces = function() {
      return this.workspaces;
    };
  }

  /**
   *  setup module
   */
  beforeEach(module('userDashboard'));

  /**
   * Inject factory and http backend
   */
  beforeEach(inject(function(codenvyWorkspace, $httpBackend) {
    factory = codenvyWorkspace;
    httpBackend = $httpBackend;
  }));

  /**
   * Check assertion after the test
   */
  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });


  /**
   * Check that we're able to fetch workspaces and calls the listeners
   */
  it('Fetch Workspaces', function() {

      // setup tests objects
      var workspace1 = {workspaceReference : {name : 'testWorkspace'}};
      var tmpWorkspace2 = {workspaceReference : {name : 'tmpWorkspace', temporary: true}};

      // Add the listener
      var listener = new Listener();
      factory.addListener(listener);

      // no workspaces now on factory or on listener
      expect(factory.getWorkspaces().length).toEqual(0);
      expect(listener.getWorkspaces().length).toEqual(0);

      // expecting a GET
      httpBackend.expectGET('/api/workspace/all');

      // providing request
      httpBackend.when('GET', '/api/workspace/all').respond([workspace1, tmpWorkspace2]);

      // fetch workspaces
      factory.fetchWorkspaces();

      // flush command
      httpBackend.flush();

      // now, check workspaces
      var workspaces = factory.getWorkspaces();

      // check we have only one workspace (temporary workspace is excluded)
      expect(workspaces.length).toEqual(1);

      // check name of the workspace
      var resultWorkspace1 = workspaces[0];
      expect(resultWorkspace1.workspaceReference.name).toEqual(workspace1.workspaceReference.name);

      // check the callback has been called without temporary workspace
      expect(listener.getWorkspaces().length).toEqual(1);
      expect(listener.getWorkspaces()[0].workspaceReference.name).toEqual(workspace1.workspaceReference.name);
    }
  );



});
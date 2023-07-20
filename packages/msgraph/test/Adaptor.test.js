import { expect } from 'chai';
import {
  execute,
  getLists,
  getSites,
  listDrives,
  getItems,
} from '../src/Adaptor.js';

import MockAgent from './mockAgent.js';
import { fixtures } from './fixtures.js';

import { setGlobalDispatcher } from 'undici';

setGlobalDispatcher(MockAgent);

describe('execute', () => {
  it('executes each operation in sequence', done => {
    const state = {};
    const operations = [
      state => {
        return { counter: 1 };
      },
      state => {
        return { counter: 2 };
      },
      state => {
        return { counter: 3 };
      },
    ];

    execute(...operations)(state)
      .then(finalState => {
        expect(finalState).to.eql({ counter: 3 });
      })
      .then(done)
      .catch(done);
  });

  it('assigns references, data to the initialState', () => {
    const state = {};

    execute()(state).then(finalState => {
      expect(finalState).to.eql({ references: [], data: null });
    });
  });
});

describe('getSites', () => {
  it('Access a sharePoint site using the siteId.', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(getSites('openfn.sharepoint.com'))(state);

    expect(JSON.parse(finalState.data)).to.eql(fixtures.sitesResponse);
  });
});

describe('getDrive', () => {
  it.skip('throws an error if resourceId or resource is not provided', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const error = await execute(listDrives({}))(state).catch(error => {
      return error;
    });

    expect(error.message).to.contain(
      'You must provide both resourceId and resource'
    );
  });
});

describe('listDrives', () => {
  it("Get current user's drives", async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(listDrives())(state);

    expect(JSON.parse(finalState.data)).to.eql(fixtures.userDrives);
  });

  it("Get a site's drives", async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(
      listDrives({ resourceId: 'openfn.sharepoint.com', resource: 'sites' })
    )(state);

    expect(JSON.parse(finalState.data)).to.eql(fixtures.drivesResponse);
  });

  it('throws an error if resourceId or resource is not provided', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const error = await execute(listDrives({}))(state).catch(error => {
      return error;
    });

    expect(error.message).to.contain(
      'You must provide both resourceId and resource'
    );
  });
});

describe('getLists', () => {
  it('throws an error if siteId is not provided', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const error = await execute(getLists())(state).catch(error => {
      return error;
    });

    expect(error.message).to.contain('You must provide a siteId');
  });
  it('Get a collection of lists for a site', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(
      getLists({ siteId: 'openfn.sharepoint.com' })
    )(state);

    expect(JSON.parse(finalState.data)).to.eql(fixtures.listsResponse);
  });

  it('Returns metadata for a list using list ID', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(
      getLists({
        siteId: 'openfn.sharepoint.com',
        listId: 'e0cb85e7-6497-4ffb-80b0-49e864bea1cd',
      })
    )(state);

    expect(JSON.parse(finalState.data)).to.eql(fixtures.sharedDocumentList);
  });
  it('Returns metadata for a list using list title', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(
      getLists({
        siteId: 'openfn.sharepoint.com',
        listId: 'Documents',
      })
    )(state);

    expect(JSON.parse(finalState.data)).to.eql(fixtures.sharedDocumentList);
  });
});

describe('getItems', () => {
  it('throws an error if siteId or listId is not provided', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const error = await execute(getItems())(state).catch(error => {
      return error;
    });

    expect(error.message).to.contain('You must provide both siteId and listId');
  });

  it('Get the collection of items in a list for a site', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(
      getItems({ siteId: 'openfn.sharepoint.com', listId: 'Documents' })
    )(state);

    expect(JSON.parse(finalState.data)).to.eql(fixtures.itemsResponse);
  });

  it('Returns the metadata for an item with downloadUrl', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(
      getItems({
        siteId: 'openfn.sharepoint.com',
        listId: 'Documents',
        itemId: 'd97073d1-5ee7-4218-97cd-bd4167078516',
      })
    )(state);

    expect(JSON.parse(finalState.data)).to.eql(fixtures.itemResponse);
  });

  it('Returns id and downloadUrl for an item', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(
      getItems(
        {
          siteId: 'openfn.sharepoint.com',
          listId: 'Documents',
          itemId: 'd97073d1-5ee7-4218-97cd-bd4167078516',
        },
        {
          select: 'id,@microsoft.graph.downloadUrl',
        }
      )
    )(state);

    expect(JSON.parse(finalState.data)).to.eql(fixtures.itemWithOptions);
  });

  it('Returns an item content', async () => {
    const state = {
      configuration: {
        accessToken: fixtures.accessToken,
      },
    };

    const finalState = await execute(
      getItems({
        siteId: 'openfn.sharepoint.com',
        listId: 'Documents',
        itemId: 'd97073d1-5ee7-4218-97cd-bd4167078516',
        itemContent: true,
      })
    )(state);

    expect(finalState.data).to.eql(fixtures.itemContent);
  });
});

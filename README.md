# Character Select for Rebar Framework

This plugin allows a user to create a character entry after authenticating, or select an existing character.

It automatically binds a `character` document to the player after authentication.

## Requires

You must have these plugins installed to use this plugin.

-   [Rebar Auth](https://github.com/Stuyk/rebar-auth)

## Features

-   Create a Character Entry
-   Delete a Character Entry
-   Select a Character Entry
-   Config to Create First & Last Name Character
-   Config to Create Single Named Character
-   Config to Limit Total Characters Allowed
-   Config for Single Character Login
-   Translations

## API

If you need to listen for when a player has selected a character you can use the `character-select-api`.

```ts
import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { Character } from '@Shared/types/character.js';

const Rebar = useRebar();
const api = Rebar.useApi();

function handleCharacterSelected(player: alt.Player, character: Character) {}

async function init() {
    // Wait for the API to be ready
    await alt.Utils.waitFor(() => api.isReady('character-select-api'), 30000);

    // Get the API
    const charSelectApi = api.get('character-select-api');

    // Hook in your event
    charSelectApi.onSelect(handleCharacterSelected);
}

init();
```

## Installation

From the main directory of your `Rebar` framework.

```
git clone https://github.com/Stuyk/rebar-character-select src/plugins/character-select
```

That's it.

If you wish to save the plugin in your own repository, go to the `src/plugins/character-select` folder and delete the `.git` folder.

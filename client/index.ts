import * as alt from 'alt-client';
import { useCamera } from '@Client/player/camera.js';

import { CharacterSelectEvents } from '../shared/characterSelectEvents.js';

const camera = useCamera();

function handleToggleControls(value: boolean) {
    alt.toggleGameControls(value);
    alt.setConfigFlag('DISABLE_IDLE_CAMERA', !value);

    if (value) {
        camera.destroy();
    } else {
        camera.create();
    }
}

alt.onServer(CharacterSelectEvents.toClient.toggleControls, handleToggleControls);

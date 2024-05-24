import * as alt from 'alt-client';
import * as native from 'natives';
import config, { ROLL_COOLDOWN } from '../shared/config.js';

function Random(min, max) {
    return Math.random() * (max - min) + min;
}

const player = alt.Player.local;
let lastRollTime = 0;

alt.everyTick(() => {
    const now = Date.now();
    const isShooting = native.isPedShooting(player);
    const isAiming = native.isControlPressed(0, 25);
    const isArmed = native.isPedArmed(player, 6);
    const isShootingControlPressed = native.isControlPressed(0, 24);
    const isRollControlPressed = native.isControlPressed(0, 22);

    if (isShooting) {
        alt.setStat('shooting_ability', Math.min(Math.max(0, config.shootingLevel), 1000));
        if (isShootingControlPressed && !isAiming) {
            native.setGameplayCamRelativePitch(native.getGameplayCamRelativePitch() + Random(0, config.relativePitch + config.relativePitchNotAiming), 1.5);
            native.setGameplayCamRelativeHeading(native.getGameplayCamRelativeHeading() + Random(-config.relativeHeadingNotAiming, config.relativeHeadingNotAiming));
        } else {
            native.setGameplayCamRelativePitch(native.getGameplayCamRelativePitch() + Random(0, config.relativePitch), 1);
            native.setGameplayCamRelativeHeading(native.getGameplayCamRelativeHeading() + Random(-config.relativeHeading, config.relativeHeading));
        }
    } else {
        alt.setStat('shooting_ability', 0);
    }

    if (isArmed && isAiming) {
        if (now - lastRollTime < ROLL_COOLDOWN) {
            native.disableControlAction(0, 22, true);
        } else if (isRollControlPressed) {
            lastRollTime = now;
        }
    }
});
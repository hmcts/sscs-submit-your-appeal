'use strict';
const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

let actions = {};

function setActorActions(data) {

    for (let k in data) {

        if (data.hasOwnProperty(k)) {

            actions[k] = data[k];
        }
    }
}

module.exports = function () {

    let stepsKeys = Object.keys(steps);

    for (let step in stepsKeys) {

        let sectionKeys = Object.keys(steps[stepsKeys[step]]);

        for (let section in sectionKeys) {

            setActorActions(steps[stepsKeys[step]][sectionKeys[section]]);
        }
    }

    return actor(actions);
};
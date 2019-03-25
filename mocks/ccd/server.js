const express = require('express');

const state = {
  appeal: {}
};

module.exports = app => {
  app.use(express.json());

  app.get('/appeal', (req, res) => {
    // eslint-disable-next-line
    console.log('=== responded with ', state['appeal']);
    res.json(state.appeal);
  });

  app.post('/appeal', (req, res) => {
    state.appeal = req.body;
    // eslint-disable-next-line
    console.log('=== state updated', state);
    // eslint-disable-next-line
    res.status(204).send();
  });
};

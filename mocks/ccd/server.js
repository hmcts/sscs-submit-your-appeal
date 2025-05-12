const express = require('express');

const state = {
  appeal: {}
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

module.exports = app => {
  app.use(express.json());

  app.get('/appeal', (req, res) => {
    // eslint-disable-next-line
    console.log('=== responded with ', state['appeal']);
    res.json(state.appeal);
  });

  app.post('/appeal', (req, res) => {
    state.appeal = req.body;

    console.log('=== state updated', state);
    // eslint-disable-next-line
    res.status(204).send();
  });
};

const express = require('express');

const PORT = 3003;

const app = express();

const state = {
  appeal: { answer: 42 }
};

app.use(express.json());

app.get('/:prefix', (req, res) => {
  const prefix = req.params.prefix;
  // eslint-disable-next-line
  console.log('=== responded with ', state[prefix]);
  res.json(state[prefix]);
});

app.post('/:prefix', (req, res) => {
  const prefix = req.params.prefix;
  state[prefix] = req.body;
  // eslint-disable-next-line
  console.log('=== state updated');
  // eslint-disable-next-line
  res.status(204).send();
});

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Listening on port ${PORT}`);
});
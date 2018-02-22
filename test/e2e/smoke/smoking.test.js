Feature('Smoking HOT!');

Before((I) => {
    I.createTheSession();
});

After((I) => {
    I.endTheSession();
});

Scenario('Smoke test demo @smoke', (I) => {

    I.see('Which benefit is your appeal about?');

});

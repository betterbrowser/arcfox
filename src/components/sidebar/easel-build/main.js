{
    __sveltekit_1tj3m53 = {
        base: new URL(".", location).pathname.slice(0, -1),
    };

    const element = document.currentScript.parentElement;

    const data = [null, null];

    Promise.all([
        import("./_app/immutable/entry/start.BU_md4wu.js"),
        import("./_app/immutable/entry/app.Cj2O8le2.js"),
    ]).then(([kit, app]) => {
        kit.start(app, element, {
            node_ids: [0, 2],
            data,
            form: null,
            error: null,
        });
    });
}
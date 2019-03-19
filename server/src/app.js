import express from "express";
import morgan from "morgan";
import compression from "compression";
import errorhandler from "errorhandler";

const author = {
    name: "Julian",
    lastname: "Hernández"
};

const app = express();

app.use(morgan("common"));
app.use(compression());

app.get("/", (req, res) => {
    res.send("Bienvenido a la API de Mercado Libre!");
});

app.get("/items", catchUnhandledErrors((req, res) => {
    let promise;
    if (req.query.q && req.query.q.trim()) {
        promise = fetch(`${process.env.API_ML_PRODUCTS_SEARCHER}?q=${req.query.q}`).then(response => response.json());
    } else {
        promise = Promise.resolve();
    }
    return promise
        .then(data => {
            let categories = [];
            let items = [];
            if (data) {
                let results = data.results || [];
                for (let i = 0; i < 4 && i < results.length; i++) {
                    let r = results[i];
                    categories.push(r.category_id);
                    items.push({
                        id: r.id,
                        title: r.title,
                        price: {
                            currency: r.currency_id,
                            amount: r.available_quantity,
                            decimals: r.price
                        },
                        picture: r.thumbnail,
                        condition: r.condition,
                        free_shipping: (r.shipping && r.shipping.free_shipping === true)
                    });
                }
            }
            res.send({
                author,
                categories,
                items
            });
        });
}));

app.get("/items/:id", catchUnhandledErrors((req, res) => {
    return Promise.all([
            fetch(`${process.env.API_ML_PRODUCT_INFO}/${req.params.id}`).then(response => response.json()),
            fetch(`${process.env.API_ML_PRODUCT_INFO}/${req.params.id}/description`).then(response => response.json())
        ])
        .then(([ info, description ]) => {
            let item;
            if (info) {
                item = {
                    id: info.id,
                    title: info.title,
                    price: {
                        currency: info.currency_id,
                        amount: info.available_quantity,
                        decimals: info.price
                    },
                    condition: info.condition,
                    free_shipping: (info.shipping && info.shipping.free_shipping === true),
                    sold_quantity: info.sold_quantity,
                    description: description.plain_text
                };
            }
            res.send({
                author,
                item
            });
        });
}));

if (process.env.NODE_ENV === "production") {
    app.use((err, req, res, next) => {
        res.status(500).send("Upps! Algo salió mal...");
        console.error(err);
    });
} else {
    app.use(errorhandler());
}

function catchUnhandledErrors(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            await next(err);
        }
    };
}

export default app;

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
                categories = (data.filters || [])
                    .filter(category => category.id === "category")
                    .map(category => category.values
                        .map(value =>  value.path_from_root
                            .map(path => path.name)
                        )
                        .find(() => true)
                    )
                    .find(() => true);

                let results = data.results || [];
                for (let i = 0; i < 4 && i < results.length; i++) {
                    let article = results[i];
                    items.push({
                        id: article.id,
                        title: article.title,
                        price: {
                            currency: article.currency_id,
                            amount: article.available_quantity,
                            decimals: article.price
                        },
                        picture: article.thumbnail,
                        condition: article.condition,
                        free_shipping: (article.shipping && article.shipping.free_shipping === true),
                        location: {
                            state: article.address.state_name,
                            city: article.address.city_name
                        }
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
            fetch(`${process.env.API_ML_PRODUCT_INFO}/items/${req.params.id}`).then(response => response.json()),
            fetch(`${process.env.API_ML_PRODUCT_INFO}/items/${req.params.id}/description`).then(response => response.json())
        ])
        .then(([ article, description ]) => 
            fetch(`${process.env.API_ML_PRODUCT_INFO}/categories/${article.category_id}`).then(response => response.json())
                .then(category => [ article, description, category ])
        )
        .then(([ article, description, category ]) => {
            let categories = (category.path_from_root || [])
                .map(path => path.name);
            let item = {
                id: article.id,
                title: article.title,
                price: {
                    currency: article.currency_id,
                    amount: article.available_quantity,
                    decimals: article.price
                },
                picture: article.pictures && article.pictures.length > 0 ? article.pictures[0].url : article.thumbnail,
                condition: article.condition,
                free_shipping: (article.shipping && article.shipping.free_shipping === true),
                sold_quantity: article.sold_quantity,
                description: description.plain_text
            };
            res.send({
                author,
                categories,
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

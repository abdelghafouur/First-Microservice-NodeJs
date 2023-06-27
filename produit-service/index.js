const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4000;
const mongoose = require("mongoose");
const Produit = require("./Produit");
app.use(express.json());
//Connection à la base de données MongoDB « publication-service-db »
//(Mongoose créera la base de données s'il ne le trouve pas)



mongoose.connect('mongodb://127.0.0.1:27017/produit-service').then(() => console.log('Connected Successfully')).catch (error => console.log(error));
app.post("/produit/ajouter", (req, res, next) => {
    const { nom, description, prix } = req.body;
    const newProduit = new Produit({
        nom,
        description,
        prix
    });

//La méthode save() renvoie une Promise.
//Ainsi, dans le bloc then(), nous renverrons une réponse de réussite avec un code 201 de réussite.
//Dans le bloc catch () , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
    newProduit.save() 
        .then(produit => res.status(201).json(produit))
        .catch(error => res.status(400).json({ error }));
});
app.post("/produit/acheter", (req, res, next) => {
    const { ids } = req.body;
    Produit.find({ _id: { $in: ids } })
        .then(produits => res.status(201).json(produits))
        .catch(error => res.status(400).json({ error }));
});
app.get("/produit/aficher", async (req, res ) => {
        // Afficher les produits
        try {
        const Produits = await Produit.find();
        res.status(200).json({
          success: true,
          count: Produits.length,
          Produits,
        });
         } 
        catch (error) {
        console.error(error.message);
      }
    });
app.listen(PORT, () => {
    console.log(`Product-Service at ${PORT}`);
});

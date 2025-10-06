// Este un router Express — adică o colecție de rute (endpoints) care gestionează operații legate de mașini (Car).

const express = require('express'); // importa Express
const router = express.Router(); // creeaza un obiect router, care ne permite sa definim rute separat de index.js
// gandirea e ca rutele pentru masini sa stea intr-un fisier dedicat.
const prisma = require('../prismaClient'); // importam clientul Prisma pe care l-am creat in prismaClient.js.

// Post /cars - Create a new car
// Primeste date despre o masina (din body) si o salveaza in baza de date
// 

router.post('/', async (req, res) => {
    try {
        const car = await prisma.car.create({ // Prisma insereaza un nou rand in tabela Car; daca e ok trimite inapoi masina nou creata cu status 201, daca nu cu eroare status 500
            data: req.body, // contine datele JSON trimise (ex: model, vin, ownerName)
        });
        res.status(201).json(car);      
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Eroare la adaugarea masinii'});
    }
});

// Get /cars - List all cars
// returneaza lista tuturor masinilor inregistrate
router.get('/', async (req, res) => {
    try{
        const cars = await prisma.car.findMany(); // extrage toate randurile din tabela Car
        res.json(cars); // Le trimite inapoi ca raspuns JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Eroare la lisstare masini'});
    }
});

// Get /cars/:id/visits - List all visits for a specific car
// Primeste un id de masina ca parametru si returneaza toate vizitele asociate acelei masini
router.get('/:id/visits', async (req, res) => {
    try {
        const carId = parseInt(req.params.id); // extrage id-ul masinii din URL si il converteste la int
        const visits = await prisma.visit.findMany({ 
            where: { carId }, 
        })
        res.json(visits); // returneaza vizitele ca raspuns JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Eroare la preluarea visitelor acestei masini'});
    }
});

// Exportam routerul
module.exports = router; // ne permite sa importam rutele in index.js si sa le activam cu app.use('/cars', carRoutes);
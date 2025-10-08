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
// Get /cars/:id - Get a specific car by ID, including its visits
router.get('/:id', async (req, res) => {
    try{
        const id = parseInt(req.params.id);
        const car = await prisma.car.findUnique({
            where: { id },
            include: { visits: true }, // include toate vizitele asociate masinii
        })
        if (!car) {
            req.status(404).json({ error: 'Masina nu a fost gasita'});
        }
        res.json(car);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Eroare la preluarea masinii'})
    }

});

// Delete /cars/:id - Delete a specific car by ID

router.delete('/:id', async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.visit.deleteMany({ // sterge toate vizitele asociate masinii inainte de a sterge masina
            where: { carId: id}
        });
        await prisma.car.delete({ // sterge masina
            where: { id }
        });
        res.json({ message: `Masina cu id ${id} si vizitele asociate au fost sterse cu succes`});
    } catch (error){
        console.error('Eroare DELETE /cars/:id', error);

        if (error.code === 'P2025') { // cod de eroare Prisma care indica faptul ca inregistrarea nu a fost gasita
            return res.status(404).json({ error: 'Masina nu a fost gasita'});
        }
        res.status(500).json({ error: 'Eroare la stergerea masinii'});
    }
});

// Exportam routerul
module.exports = router; // ne permite sa importam rutele in index.js si sa le activam cu app.use('/cars', carRoutes);
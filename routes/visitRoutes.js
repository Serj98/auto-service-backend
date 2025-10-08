const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');

// Post /visits - Create a new visit
router.post('/', async( req, res) => {
    const { carId, description, date, mileage} = req.body;

try {
    const visit = await prisma.visit.create({
        data: {
            carId,
            description,
            date: new Date(date),
            mileage,
        }
    });
    res.status(201).json(visit);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Eroare la adaugarea vizitei' });
}
});

// Get /visits - List all visits
router.get('/', async (req, res) => {
    try {
        const visits = await prisma.visit.findMany({
            include: {
                car:true,
            }
        });
        res.json(visits);
    } catch ( error) {
        console.log(error);
        res.status(500).json({ error: 'Eroare la listarea vizitelor'});
    }
});

// Get /visits/:id - Get a specific visit by ID

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const visit = await prisma.visit.findUnique({ 
                where: { id },
                include: { car: true}, // includem datele masinii asociate vizitei 
            });
            if (!visit) {
                res.status(404).json({ error: 'Vizita nu a fost gasita' });
            }
            res.json(visit);
    } catch (error) {
        console.log(error);
        req.status(500).json({ error: 'Eroare la preluarea vizitei'});
    }
});

// Delete /visits/:id - Delete a specific visit by ID

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.visit.delete({
            where: { id },
        })
        res.json( {message: `Vizita cu id-ul ${id} a fost stearsa cu succes`});
    } catch (error) {
        console.error('Eroare DELETE /visits/:id', error);
        if( error.code === 'P2025') { // cod de eroare Prisma care indica faptul ca inregistrarea nu a fost gasita
            return res.status(404).json({ error: 'Vizita nu a fost gasita'});
        }
        res.status(500).json({error: 'Eroare la stergerea vizitei'});
    }
});

module.exports = router;
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

module.exports = router;
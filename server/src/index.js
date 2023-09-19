const express = require('express');
const app = express();
const port = 3001;
const dataList = require('./schedules.json');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const exp = require('constants');

app.use(express.static('public'));
app.use(express.json());

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


app.listen(port, () => {
    console.log("Servidor iniciado!", port)
});

app.get('/schedules', (request, response) =>
    fs.readFile(__dirname + '/schedules.json', (error, data) => 
        response.status(200).send({ message: JSON.parse(data) })));


app.post('/schedules', (request, response) => {
    const { body } = request;

    fs.readFile(__dirname + '/schedules.json', (error, data) => {
        if (error)
            return request.status(500).json({ error: "Erro ao ler arquivo!" });

            const newSchedule = {
                id: Date.now(),
                nome: body.nome,
                email: body.email,
                dataMarcada: body.dataMarcada,
                duracao: body.duracao
            };

            const convertedData = JSON.parse(data)

            convertedData.push(newSchedule);

        fs.writeFile(__dirname + '/schedules.json', JSON.stringify(convertedData), (err) => {
            if (err)
                return response.status(500).json({ error: "Erro ao salvar registro!" });

            response.end().status(201);
        });
    });

})

app.put('/schedules/:id', (request, response) => {
    const { params, body } = request;
    
    fs.readFile(__dirname + '/schedules.json', (error, data) => {
        if (error)
            return response.status(500).json({ error: "Erro ao ler arquivo!" });
        

        const convertedData = JSON.parse(data);

        const scheduleToEditIndex = convertedData.findIndex(sch => sch.id === Number(params.id));

        const updatedSchedule = {
            ...convertedData[scheduleToEditIndex],
            nome: body.nome,
            email: body.email,
            dataMarcada: body.dataMarcada,
            duracao: body.duracao
        };
        
        convertedData[scheduleToEditIndex] = updatedSchedule;

        fs.writeFile(__dirname + '/schedules.json', JSON.stringify(convertedData), (err) => {
            if (err)
                return response.status(500).json({ error: "Erro ao salvar registro!" });
            
            response.end().status(200);
        });
    });
})


app.delete('/schedules/:id', (request, response) => {
    const { params } = request;

    console.log('params: ', params.id);

    fs.readFile(__dirname + '/schedules.json', (error, data) => {
        if (error)
            return response.status(500).json({ error: "Erro ao ler arquivo!" });

        const convertedData = JSON.parse(data);
        const scheduleToEditIndex = convertedData.findIndex(sch => sch.id == params.id);

        if (scheduleToEditIndex === -1)
            return response.status(404).json({ error: 'Registro não encontrado' });

        convertedData.splice(scheduleToEditIndex, 1);

        fs.writeFile(__dirname + '/schedules.json', JSON.stringify(convertedData), (err) => {
            if (err)
                return res.status(500).json({error: "Erro ao salvar registro!"});
            
            response.json(convertedData);
        });
    });
})
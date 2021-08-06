const inquirer = require('inquirer');

const getTruskerName = async function () {
    const value = await inquirer
        .prompt([{
            type: 'string',
            name: 'response',
            message: 'Bonjour, quel est votre nom?',
        }])

    if (value.response === '' || /\d/.test(value.response)) {
        console.log('Vous ne pouvez pas mettre de chiffres')
        return await getTruskerName()
    }
    return value.response
}

const getSocietyName = async function () {
    const value = await inquirer
        .prompt([{
            type: 'string',
            name: 'response',
            message: 'Quel est le nom de votre société',
        }])
    if (value.response === '') {
        console.log('Vous ne pouvez pas mettre de réponse vide')
        return await getTruskerName()
    }
    return value.response
}

const getWorkerNumber = async function () {
    const value = await inquirer
        .prompt([{
            type: 'string',
            name: 'response',
            message: 'Combien y a t-il d\'employer?',
        }])
    if (!/[a-zA-Z]./.test(value.response) && value.response % 1 === 0) {
        return value.response
    }
    console.log('Vous ne pouvez mettre que des nombres entiers')
    return await getWorkerNumber()
}

const getWorkerName = async function (workerNumber) {
    const value = await inquirer
        .prompt([{
            type: 'string',
            name: 'response',
            message: 'Donner le nom de vos employer, séparer les par un espace.',
        }])
    if (/\d/.test(value.response)) {
        console.log('\nVous ne pouvez pas mettre de chiffres')
        return await getWorkerName(workerNumber)
    }
    const worker = value.response.split(' ')
    if (worker.length !== Number(workerNumber)) {
        console.log(`\nVous avez mis ${worker.length} employer et il en faut ${workerNumber}`)
        return await getWorkerName(workerNumber)
    }
    return worker
}

const getTruckNumber = async function () {
    const value = await inquirer
        .prompt([{
            type: 'string',
            name: 'response',
            message: 'Combien y a t-il de camion?',
        }])
    if (!/[a-zA-Z]./.test(value.response) && value.response % 1 === 0) {
        return value.response
    }
    console.log('Vous ne pouvez mettre que des nombres entiers')
    return await getTruckNumber()
}

const getTruckVolume = async function (truckNumber) {
    const value = await inquirer
        .prompt([{
            type: 'string',
            name: 'response',
            message: 'Mettez les volumes en metres cubes de chaques camions, séparer les par un espace.',
        }])
    const volumes = value.response.split(' ')
    if (await volumes.some((volume) => isNaN(volume))) {
        console.log('\nVous ne pouvez mettre que des  chiffres')
        return await getTuckVolume(truckNumber)
    }
    if (volumes.length !== Number(truckNumber)) {
        console.log(`\nVous avez mis ${volumes.length} employer et il en faut ${truckNumber}`)
        return await getTuckVolume(truckNumber)
    }
    return volumes
}

const getTruckType = async function () {
    const value = await inquirer
        .prompt([{
            type: 'string',
            name: 'response',
            message: 'Quel est le type de vos camions',
        }])
    if (value.response === '') {
        console.log('Vous ne pouvez pas mettre de réponse vide')
        return await getTruckType()
    }
    return value.response
}

const getValidation = async function (message) {
    const value = await inquirer
        .prompt([{
            type: 'string',
            name: 'response',
            message: message,
        }])
    if (value.response !== 'oui' && value.response !== 'non')
        await getValidation(message)
    if (value.response === 'non')
        await start()
}

const start = async function () {
    const truskerName = await getTruskerName()
    const societyName = await getSocietyName()
    const workerNumber = await getWorkerNumber()
    const workerNames = await getWorkerName(workerNumber)
    const truckNumber = await getTruckNumber()
    const truckVolume = await getTruckVolume(truckNumber)
    const truckType = await getTruckType()
    console.log('fkjdkfjsdk')
    const message = `Voici un résumer des données que vous avez mis:
    \nvotre nom: ${truskerName}
    \nle nom de votre société: ${societyName}
    \nle nom de vos d'employés \n${workerNames.join('\n')}
    \nles volumes de vos camions \n${truckVolume.join('\n')}
    \nle type de camions: ${truckType}
    \nConfirmer vous les données, mettez oui pour valider ou non pour recommencer?
    `
    await getValidation(message)
}
start()
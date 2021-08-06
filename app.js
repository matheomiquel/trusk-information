const inquirer = require('inquirer');
const redis = require("redis");
const client = redis.createClient();

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
    return value.response
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
    return value.response
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
    if (value.response === 'non') {
        client.del('truskerName')
        client.del('societyName')
        client.del('workerNumber')
        client.del('workerNames')
        client.del('truckNumber')
        client.del('truckVolume')
        client.del('truckType')
        await start()
    }
    process.exit(0)
}

const start = async function () {
    const truskerName = await new Promise(
        function (resolve, reject) {
            client.get('truskerName', async function (err, truskerName) {
                if (truskerName) {
                    resolve(truskerName)
                } else {
                    const truskerName = await getTruskerName()
                    client.set('truskerName', truskerName)
                    resolve(truskerName)
                }
            })
        })

    const societyName = await new Promise(
        function (resolve, reject) {
            client.get('societyName', async function (err, societyName) {
                if (societyName) {
                    resolve(societyName)
                } else {
                    const societyName = await getSocietyName()
                    client.set('societyName', societyName)
                    resolve(societyName)
                }
            })
        })

    const workerNumber = await new Promise(
        function (resolve, reject) {
            client.get('workerNumber', async function (err, workerNumber) {
                if (workerNumber) {
                    resolve(workerNumber)
                } else {
                    const workerNumber = await getWorkerNumber()
                    client.set('workerNumber', workerNumber)
                    resolve(workerNumber)
                }
            })
        })
    const workerNames = await new Promise(
        function (resolve, reject) {
            client.get('workerNames', async function (err, workerNames) {
                if (workerNames) {
                    resolve(workerNames)
                } else {
                    const workerNames = await getWorkerName(workerNumber)
                    client.set('workerNames', workerNames)
                    resolve(workerNames)
                }
            })
        })


    const truckNumber = await new Promise(
        function (resolve, reject) {
            client.get('truckNumber', async function (err, truckNumber) {
                if (truckNumber) {
                    resolve(truckNumber)
                } else {
                    const truckNumber = await getTruckNumber()
                    client.set('truckNumber', truckNumber)
                    resolve(truckNumber)
                }
            })
        })
    const truckVolume = await new Promise(
        function (resolve, reject) {
            client.get('truckVolume', async function (err, truckVolume) {
                if (truckVolume) {
                    resolve(truckVolume)
                } else {
                    const truckVolume = await getTruckVolume(truckNumber)
                    client.set('truckVolume', truckVolume)
                    resolve(truckVolume)
                }
            })
        })
    const truckType = await new Promise(
        function (resolve, reject) {
            client.get('truckType', async function (err, truckType) {
                if (truckType) {
                    resolve(truckType)
                } else {
                    const truckType = await getTruckType()
                    client.set('truckType', truckType)
                    resolve(truckType)
                }
            })
        })
    const message = `Voici un résumer des données que vous avez mis:
    \nvotre nom: ${truskerName}
    \nle nom de votre société: ${societyName}
    \nle nom de vos d'employés \n${workerNames.split(' ').join('\n')}
    \nles volumes de vos camions \n${truckVolume.split(' ').join('\n')}
    \nle type de camions: ${truckType}
    \nConfirmer vous les données, mettez oui pour valider ou non pour recommencer?
    `


    getValidation(message)

}
start()
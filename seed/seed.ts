import 'dotenv/config'

import database from '../bin/config/database'

database()

import fs from 'fs'
import path from 'path'
import Specie from '@/models/Specie'
import ProductionSystem from '@/models/ProductionSystem'
import LifeFate from '@/models/LifeFate'
import Phase from '@/models/Phase'
import Circumstance from '@/models/Circumstance'
import { Model } from 'mongoose'

interface ISeeds {
    model:Model<any>
    file:string
}

let seeds : ISeeds[] = [
    {
        model:Specie,
        file:'01-specie.json'
    },
    {
        model:ProductionSystem,
        file:'02-production_system.json'
    },
    {
        model:LifeFate,
        file:'03-life_fate.json'
    },
    {
        model:Phase,
        file:'04-phase.json'
    },
    {
        model:Circumstance,
        file:'05-circumstance.json'
    }
]

seeds.forEach(async ({model,file},seed_index) => {
    try {
        let documents : any[] = JSON.parse(fs.readFileSync(path.resolve(__dirname,file),'utf-8'))
        await model.insertMany(documents)    
        console.log(`Inserted on '${file}'`)
    } catch (error) {
        // console.error(error)
    }
})


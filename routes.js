const express = require('express')

const routes = new express.Router()

const details = {
    name: 'Chinedu Mbah',
    github: '@nedlarry',
    email: 'chinedu.mbah.g20@gmail.com',
    mobile: '08160205083',
    twitter: '@nedddum'
}

routes.get('/', (req, res) => {
    res.status(200).json({message: 'My Rule-Validation API', status: 'success', data: details})
})


routes.post('/validate-rule', (req, res) => {
    req.method = 'POST'
    try {
        
        const RULE_REQUIRED = ['field', 'condition', 'condition_value']
        const PAYLOAD_REQUIERED = ['rule', 'data']
    
        const payLoadKeys = Object.keys(req.body)
        const PAYLOAD = req.body
    
        const rules = {...PAYLOAD.rule}
        const data = {...PAYLOAD.data}
    
        if(typeof PAYLOAD == null || undefined){
            return res.status(400).json({message: 'Invalid JSON Payload',status:'error', data:null})
        }
    
        Object.keys(PAYLOAD).forEach(field =>{
    
            if (field == 'rule'){
                if (typeof PAYLOAD[field] != 'object'){
                    res.status(400).json({message: `${field} should be an object.`, status: 'error'})
                }
            } 
            if (field == 'data'){
                if (typeof PAYLOAD[field] !== 'object' ){
                    res.status(400).json({message: `${field} should be an object.`, status: 'error'})
                }
            } 
        })
    
    
        PAYLOAD_REQUIERED.forEach(required => {
            if (!payLoadKeys.includes(required)){
                res.status(400).json({message: required +" is required.", status: 'error'})
            }
        })
    
        if(typeof(rules) != 'object'){
            res.status(400).json({message: "rule should be an object.", status: 'error'})
        }
    
        RULE_REQUIRED.forEach(required => {
            if(!rules.hasOwnProperty(required)){
                res.status(400).json({"message": required +" is required.", status: 'error'})
            }
        })
    
        if(!Object.keys(data).includes(rules.field)){
            res.status(400).json({message: 'field ' + rules.field + ' is missing from data', status: 'error'})
        }
    
        const validationObj = validationCheck(rules, data)
        const validationReport = {validation: validationObj}
    
        if (validationObj.error){
            res.status(400).json({message: `field ${rules.field} failed validation.`,status: 'error', data: validationReport})
        }
    
        res.status(200).json({message:`field ${rules.field} successfully validated.`, status: 'success', data: validationReport })

    } catch (error) {
        res.status(400).json({error})
        
    }



    

})

function validationCheck(rule = {}, data={}){

    const condition = rule.condition
    const condition_value = rule.condition_value

    let validation = {
        error: false,
        field: rule.field,
        field_value: data[rule.field],
        condition,
        condition_value
    }

    switch (condition) {

        case 'eq':

            if(data[rule.field] !== condition_value){
                validation.error = true
            }
            
        break;

        case 'neq':

            if(data[rule.field] == condition_value){
                validation.error = true
            }
            
        break;

        case 'gt':

            if(data[rule.field] < condition_value){
                validation.error = true
            }
            
        break;

        case 'gte':
            if(data[rule.field] <= condition_value){
                validation.error = true
            }
            
        break;

        case 'contains':
            if(!data[rule.field].includes(condition_value)){
                validation.error = true
            }
            
        break;
    
        default:
            break;
    }

    return validation
}

module.exports = routes
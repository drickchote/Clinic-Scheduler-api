
const file = require('../helpers/file');
const moment = require('moment');
const { enumerateDaysBetweenDates } = require('../helpers/date');
module.exports = {
     index(req, res){
        const rules = file.read();
        return res.status(200).json({
            rules:rules
        });
    },

    store(req, res){
        const rules = file.read();
        let {type, days, intervals, date} = req.body;
     
        
        if(type === "date"){
            intervals.forEach(interval=>{
                let rule = {
                    id: rules.length,
                    date: date,
                    day: moment(date,"DD-MM-YYYY").format("d"),
                    interval: interval
                }
                rules.push(rule);
            })            
        } else{
            days = type === "weekly" ? days : [0,1,2,3,4,5,6];
            days.forEach(day=>{
                intervals.forEach(interval=>{
                    let rule = {
                        id: rules.length,
                        day: day,
                        interval: interval
                    }
                    rules.push(rule);
                })
            })
        } 
        file.write(rules);
        return res.status(201).json({
            message: "successfully created rule.",
            rules : rules,
            success: true
        });
    },

    destroy(req, res){
        const rules = file.read();
        const id = req.params.id;
        const index = rules.findIndex(rule=>rule.id == id);
        let message = "No rule with this id was found.";
        let rule = null;
        if(index !== -1){
            rule = rules.splice(index,1);
            message = "successfully deleted rule.";
        }

        file.write(rules);

        return res.status(200).json({
            message: message,
            rule:rule,
            rules : rules,
            success: true
        });
    },

    getInterval(req, res){
        let {initialDate, finalDate} = req.params; 
        const rules = file.read();
        initialDate = moment(initialDate, "DD-MM-YYYY");
        finalDate = moment(finalDate, "DD-MM-YYYY");
        let rulesByDate = [];
        
        rules.forEach(rule=>{
            if(rule.date){
                let formatedDate = moment(rule.date, "DD-MM-YYYY");
                if(formatedDate.isBetween(initialDate, finalDate,null,"[]")){
                    let index = formatedDate.diff(initialDate,'days');
                    rulesByDate[index] = rulesByDate[index] ? rulesByDate[index] : [];
                    rulesByDate[index].push(rule)
                }
            } else {
                enumerateDaysBetweenDates(initialDate,finalDate).forEach(date=>{
                    let formatedDate = moment(date, "DD-MM-YYYY");
                    if(formatedDate.format("d") == rule.day){
                        let index = formatedDate.diff(initialDate,'days');
                        rulesByDate[index] = rulesByDate[index] ? rulesByDate[index] : [];
                        rule.date = date;
                        rulesByDate[index].push(rule)
                    }
                })  
                
            }
        })
        const response = [];

        // re-index the array rulesByDate
        rulesByDate = rulesByDate.filter(()=>true);
        
        rulesByDate.forEach((ruleByDate, index)=>{
            intervals = ruleByDate.map(item=>item.interval);
            response.push({
                day: ruleByDate[0].date,
                intervals: intervals
            })
        })
        return res.status(200).json({
            rules:response
        })

    }

}
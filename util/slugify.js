

exports.slugify =(objdata, lowercase = true, replacement ="-")=>{

    let arr =[]
    Object.values(objdata).forEach((e)=> arr.push(e.split(" ").join(replacement)))
    let returnslug;
    if(lowercase ){

      return arr.toString().split(",").join(replacement).toLowerCase()
    }else{
        return arr.toString().split(",").join("-")
    }   

}
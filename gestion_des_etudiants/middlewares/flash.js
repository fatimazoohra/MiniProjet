module.exports = function(request, response, next){
    
   /* 
    */
    request.flash = function(type, content){
       /* if(request.session.flash){
            //request.session.flash = undefined
        }*/
        if(request.session.flash === undefined){
           request.session.flash = {}
        }
        request.session.flash = {
            type : type,
            message : content
        }
        request.session.flash[type] = content
        response.locals.flash = request.session.flash[type]
        //console.log(response.locals.flash.type)
    }
    next()
}



/* <% if(locals.flash) { %>
        <div class= "ui negative message"> <%= flash.error %> </div>
    <% } %>*/

Queryables = {
	getAll: function() {
		var query = window.location.search.substring(1).replace('/', '')
			, params = {}
			, str_params = query.split('&')

		if(query.length==0) {return {}}
			
		for(var i = 0; i < str_params.length; i++) {
			var pair = str_params[i].split('=')
			params[pair[0]] = pair[1]
		}
		return params
	},
	compose: function(params) {
		var str_params = []
		for(var i in params) {
			str_params.push(i.toString() + '=' + params[i])
		}
		return '?' + str_params.join('&')
	}
}
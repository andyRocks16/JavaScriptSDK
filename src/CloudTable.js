/*
  CloudTable
 */

CB.CloudTable = function(tableName){  //new table constructor

  CB._tableValidation(tableName);
  this.document = {};
  this.document.name = tableName;
  this.document.appId = CB.appId;
  this.document._type = 'table';

  if(tableName.toLowerCase() === "user") {
      this.document.type = "user";
      this.document.maxCount = 1;
  }
  else if(tableName.toLowerCase() === "role") {
      this.document.type = "role";
      this.document.maxCount = 1;
  }
  else {
      this.document.type = "custom";
      this.document.maxCount = 9999;
  }
  this.document.columns = CB._defaultColumns(this.document.type);
};

CB.CloudTable.prototype.addColumn = function(column){
  if (Object.prototype.toString.call(column) === '[object Object]') {
    if(CB._columnValidation(column, this))
      this.document.columns.push(column);

  } else if (Object.prototype.toString.call(column) === '[object Array]') {
      for(var i=0; i<column.length; i++){
        if(CB._columnValidation(column[i], this))
          this.document.columns.push(column[i]);
      }
  }
}

CB.CloudTable.prototype.deleteColumn = function(column){
  if (Object.prototype.toString.call(column) === '[object Object]') {
        if(CB._columnValidation(column, this)){
          this.document.columns = this.document.columns.filter(function(index){return index.name != column.name });
        }

  } else if (Object.prototype.toString.call(column) === '[object Array]') {
      //yet to test
      for(var i=0; i<column.length; i++){
        if(CB._columnValidation(column[i], this)){
          this.document.columns = this.document.columns.filter(function(index){return index.name != column[i].name });
        }
      }
  }
}

/**
 * Gets All the Tables from an App
 *
 * @param callback
 * @returns {*}
 */

CB.CloudTable.getAll = function(callback){
  if (!CB.appId) {
      throw "CB.appId is null.";
  }

  var def;
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey
  });

  var url = CB.serviceUrl+'/'+CB.appId +"/table";
  CB._request('POST',url,params,true).then(function(response){
    response = JSON.parse(response);
    var obj = CB.fromJSON(response);
    if (callback) {
        callback.success(obj);
    } else {
        def.resolve(obj);
    }
  },function(err){
      if(callback){
          callback.error(err);
      }else {
          def.reject(err);
      }
  });
  if (!callback) {
      return def;
  }
}

/**
 * Gets a table
 *
 * @param table
 *  It is the CloudTable object
 * @param callback
 * @returns {*}
 */


CB.CloudTable.get = function(table, callback){
  if(Object.prototype.toString.call(table) === '[object String]') {
      var obj = new CB.CloudTable(table);
      table = obj;
  }
  if (Object.prototype.toString.call(table) === '[object Object]') {
    {
      if (!CB.appId) {
          throw "CB.appId is null.";
      }

      var def;
      if (!callback) {
          def = new CB.Promise();
      }

      var params=JSON.stringify({
          key: CB.appKey,
          appId: CB.appId
      });

      var url = CB.serviceUrl + '/' + CB.appId + "/table/" + table.document.name;
      CB._request('POST',url,params,true).then(function(response){
          if(response === "null"){
            obj = null;
        }else{
            response = JSON.parse(response);
            var obj = CB.fromJSON(response);
        }
          if (callback) {
              callback.success(obj);
          } else {
              def.resolve(obj);
          }
      },function(err){
          if(callback){
              callback.error(err);
          }else {
              def.reject(err);
          }
      });
      if (!callback) {
          return def;
      }

    }
  } else if (Object.prototype.toString.call(table) === '[object Array]') {
    throw "cannot fetch array of tables";
  }
}


/**
 * Deletes a table from database.
 *
 * @param table
 * @param callback
 * @returns {*}
 */

CB.CloudTable.delete = function(table, callback){
  if (Object.prototype.toString.call(table) === '[object Object]') {
      if (!CB.appId) {
          throw "CB.appId is null.";
      }

      var def;
      if (!callback) {
          def = new CB.Promise();
      }

      var params=JSON.stringify({
          key: CB.appKey,
          name: table.document.name
      });

      var url = CB.serviceUrl + '/' + CB.appId + "/table/" +table.document.name;

      CB._request('DELETE',url,params,true).then(function(response){
        if (callback) {
            callback.success(response);
        } else {
            def.resolve(response);
        }
      },function(err){
          if(callback){
              callback.error(err);
          }else {
              def.reject(err);
          }
      });
      if (!callback) {
          return def;
      }
  } else if (Object.prototype.toString.call(table) === '[object Array]') {
    throw "cannot delete array of tables";
  }
}

/**
 * Saves a table
 *
 * @param callback
 * @returns {*}
 */

CB.CloudTable.prototype.save = function(callback){
  var def;
  if (!callback) {
      def = new CB.Promise();
  }
  CB._validate();
  var thisObj = this;
  var params=JSON.stringify({
      key:CB.appKey,
      data:CB.toJSON(thisObj)
  });

  var url = CB.serviceUrl +'/' + CB.appId + "/table/" + thisObj.document.name;

    CB._request('PUT',url,params,true).then(function(response){
      response = JSON.parse(response);
      var obj = CB.fromJSON(response);
      if (callback) {
          callback.success(obj);
      } else {
          def.resolve(obj);
      }
  },function(err){
      if(callback){
          callback.error(err);
      }else {
          def.reject(err);
      }
  });

  if (!callback) {
      return def;
  }
};




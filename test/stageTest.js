describe("Server Check",function(){
    it("should check for localhost",function(done){
        this.timeout(10000);
        var xmlhttp;
        this.timeout(10000);
        var req = typeof(require) === 'function' ? require : null;
        // Load references to other dependencies
        if (typeof(XMLHttpRequest) !== 'undefined') {
            xmlhttp = XMLHttpRequest;
        } else if (typeof(require) === 'function' &&
            typeof(require.ensure) === 'undefined') {
            xmlhttp = req('xmlhttprequest').XMLHttpRequest;
        }
        xmlhttp = new xmlhttp();
        CB.appId = 'travis123';
        CB.appKey = '6dzZJ1e6ofDamGsdgwxLlQ==';
        CB.serverUrl = 'http://localhost:4730';
        CB.socketIoUrl = CB.serverUrl;
        CB.apiUrl = CB.serverUrl + '/api';
        done();
    });
});
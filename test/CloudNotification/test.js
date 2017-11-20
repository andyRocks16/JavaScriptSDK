describe("CloudNotification", function () {

	it("should subscribe to a channel", function (done) {
		var done_called = false;
		this.timeout(20000);
		CB.CloudNotification.on('sample',
			function (data) {
			},
			{
				success: function () {
					if(!done_called){
						done_called = true;
						done();
					}
				},
				error: function () {
					throw 'Error subscribing to a CloudNotification.';
				}
			});
	});

	it("should publish data to the channel.", function (done) {
		var done_called = false;
		this.timeout(30000);
		CB.CloudNotification.on('sample', function (data) {
			console.log(data, "ppp")
			if (data === 'data') {
				console.log("now dallint")
				if(!done_called){
					done_called = true;
					done();
				}
				return;
			} else {
				console.log("Errrrr12")
				throw 'Error wrong data received.';
			}
		},
			{
				success: function () {
					//publish to a channel. 
					CB.CloudNotification.publish('sample', 'data', {
						success: function () {
							//succesfully published. //do nothing. 
							console.log("Published Successfully.");
						},
						error: function (err) {
							console.log(err, "lll")
							//error
							throw 'Error publishing to a channel in CloudNotification.';
						}
					});
				},
				error: function (err) {
					console.log("Errr", err)
					throw 'Error subscribing to a CloudNotification.';
				}

			});
	});


	it("should stop listening to a channel", function (done) {

		this.timeout(20000);
		var done_called = false;
		CB.CloudNotification.on('sample',
			function (data) {
				throw 'stopped listening, but still receiving data.';
			},
			{
				success: function () {
					//stop listening to a channel. 
					CB.CloudNotification.off('sample', {
						success: function () {
							//succesfully stopped listening.
							//now try to publish. 
							CB.CloudNotification.publish('sample', 'data', {
								success: function () {
									//succesfully published.
									//wait for 5 seconds.
									setTimeout(function () {
										if(!done_called){
											done_called = true;
											done();
										}
									}, 5000);
								},
								error: function (err) {
									//error
									throw 'Error publishing to a channel.';
								}
							});
						},
						error: function (err) {
							//error
							throw 'error in sop listening.';
						}
					});
				},
				error: function () {
					throw 'Error subscribing to a CloudNotification.';
				}
			});


	});

});
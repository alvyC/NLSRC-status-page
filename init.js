/*
  Script used to retrieve status content based on the given names, and update the tables
  on the status page

  Muktadir Chowhury - mrchwdhr@memphis.edu
*/

var face;

// Enables the tabs to work
$('#myTab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

function onData(interest, encodedMessage) {
  console.log("Got data for " + interest.getName().toUri());
  console.log(data.buf().toString('binary'));
  var contentS = data.buf().toString('binary');

  var nameStr = interest.getName().toUri().split("/");
  lsType = lsType[lsType.length-1]
  console.log(lsType);

  if (lsType == "names") {
    console.log("Got Name LSA Data:");
    parseNameLsa(encodedMessage);
  }
  else if (lsType == "adjacencies") {
    console.log("Got Adjaceny LSA Data: ");
    parseAdjacentLsa(encodedMessage);
  }
  else {
    console.log("LSA type: " + lsType + " is unknown");
  }
}

function onTimeout(interest) {
  console.log("Interest timed out: " + interest.getName().toUri());
  console.log("Host: " + face.connectionInfo.toString());

  console.log("Reexpressing interest for " + interest.getName().toUri());

  SegmentFetcher.fetch(face, interest, SegmentFetcher.DontVerifySegment,
                       function(encodedMessage) { console.log("Got data"); onData(interest, encodedMessage);},
                       function(errorCode, message) { console.log("Error #" + errorCode + ": " + message); /*onTimeout(interest);*/}
                      );
}


function getLsa(lsType) {
  console.log("init:getLsa()");
  var interest = new Interest(new Name("/ndn/edu/memphis/%C1.Router/titan/lsdb/" + lsType));
  //var interest = new Interest(new Name("/ndn/edu/%C1.Router/cs/root/lsdb/" + lsType));
  console.log("Express Interest: " + interest.getName().toUri());
  interest.setInterestLifetimeMilliseconds(4000);
  result.innerHTML += "Express interest " + interest.getName().toUri() + "</br>";
  SegmentFetcher.fetch (face, interest, SegmentFetcher.DontVerifySegment,
                        function(encodedMessage) {
                          console.log("Got data.");
                          onData(interest, encodedMessage);
                        },
                        function(errorCode, message) {
                          console.log("Error.");
                          result.innerHTML += message + "</br>";
                        });
}


$(document).ready(function() {
  face = new Face({host:"titan.cs.memphis.edu"});
  getLsa("names");
  getLsa("adjacencies");
};
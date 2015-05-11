// const {Cu} = require("chrome");
// const {TextDecoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
// const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});


function get_certs() {
  //Returns the certs saved on the system
  Components.utils.import("resource://gre/modules/FileUtils.jsm");
  var file = FileUtils.File("C:\\Users\\daxx\\Documents\\Classes\\Senior\ Project\\SeniorProject\\addon\\certs.txt");
  console.log(file.exists())
  var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].
  createInstance(Components.interfaces.nsIFileInputStream);
  istream.init(file, 0x01, 0444, 0);
  istream.QueryInterface(Components.interfaces.nsILineInputStream);

  var line = {},
    lines = [],
    hasmore;
  do {
    hasmore = istream.readLine(line);
    lines.push(line.value);
  } while (hasmore);

  istream.close();
  return lines;
}

/**
 * CertManager namespace.
 */
if ("undefined" == typeof(CertManager)) {
  var CertManager = {};
};

/**
 * Controls the tab overlay for the extension.
 */


var treeView = {
  childData: {
    0: ["Never", "USA", "stuff"],
    1: ["Today", "China", "stuff2"]
  },
  visibleData: [
    [
      ["builtInCert", "SidTrust", "Green", "true"], true, false
    ],
    [
      ["customCert", "Dax Trust", "Red", "false"], true, false
    ]
  ],
  treeBox: null,
  get rowCount() {
    return this.visibleData.length;
  },
  getCellText: function(row, column) {
    switch (column.id) {
      case ("sourceColumn"):
        if (!this.isContainer(row)) return this.visibleData[row][0][0]
        break;
      case ("authorityColumn"):
        return this.visibleData[row][0][1];
      case ("trustworthinessColumn"):
        return this.visibleData[row][0][2];
    }
  },
  setTree: function(treebox) {
    this.treeBox = treebox;
  },
  isContainer: function(row) {
    return this.visibleData[row][1];
  },
  isContainerOpen: function(row) {
    return this.visibleData[row][2];
  },
  isContainerEmpty: function(row) {
    return false;
  },
  isSeparator: function(row) {
    return false;
  },
  isSorted: function() {
    return false;
  },
  getParentIndex: function(row) {
    if (this.isContainer(row)) return -1;
    for (var i = row - 1; i >= 0; i--) {
      if (this.isContainer(i)) return i;
    }
  },
  getLevel: function(row) {
    if (this.isContainer(row)) return 0;
    return 1;
  },
  hasNextSibling: function(row, after) {
    var level = this.getLevel(row);
    for (var i = after + 1; i < this.visibleData.length; i++) {
      var nlevel = this.getLevel(i);
      if (nlevel == level) return true;
      if (nlevel < thisLevel) break;
    }
    return false;
  },
  toggleOpenState: function(row) {
    var data = this.visibleData[row];
    if (!data[1]) return;

    if (data[2]) {
      data[2] = false;

      /** Stock 3 rows on toggle atm */
      this.visibleData.splice(row + 1, 3);
      if (this.treeBox) this.treeBox.rowCountChanged(row + 1, -3);
    } else {
      data[2] = true;
      var toInsert = this.childData[row]
      this.visibleData.splice(row + 0 + 1, 0, [
        ["Last Audit:", toInsert[0]], false
      ]);
      this.visibleData.splice(row + 1 + 1, 0, [
        ["Country:", toInsert[1]], false
      ]);
      this.visibleData.splice(row + 2 + 1, 0, [
        [toInsert[2]], false
      ]);
      if (this.treeBox) this.treeBox.rowCountChanged(row + 1, 3);
    }
    if (this.treeBox) this.treeBox.invalidateRow(row);
  },
  getImageSrc: function(row, col) {
    return null;
  },
  getRowProperties: function(row, props) {},
  getCellProperties: function(row, column, props) {
    if (this.isContainer(row)) {
      switch (column.id) {
        case ("sourceColumn"):
          return this.visibleData[row][0][0];
        case ("trustworthinessColumn"):
          return "greenTrust"; /** TODO update with  color logic */
      }
    }
  },

  getColumnProperties: function(colid, col, props) {},
  isEditable: function(row, col) {
    if (col.id == "trustedColumn" && this.isContainer(row)) return true;
    else return false;
  },
  setCellValue: function(row, col, value) {
    if (this.isContainer(row)) {
      this.visibleData[row][0][3] = value;
    }
  },
  getCellValue: function(row, col) {
    return this.visibleData[row][0][3];
  },
};

function setView() {
  document.getElementById('certView').view = treeView;
}
var gCertPane = {
  init: function() {
    function setEventListener(aId, aEventType, aCallback) {
      document.getElementById(aId)
        .addEventListener(aEventType, aCallback.bind(gContentPane));
    }
    setView();
  },
};

register_module("paneCertManager", gCertPane);

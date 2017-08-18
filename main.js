const canvas = new fabric.Canvas('canvas');
const allItems = [];

(function(){
  canvas.setWidth(document.body.clientWidth);
  canvas.setHeight(document.body.clientHeight);
  setupBackgroundObjects();

  document.addEventListener('paste', function(e) {
    e.preventDefault();
    pastedText = e.clipboardData.getData('text/plain');
    items = pastedText.split('\n').filter(function (e) { return e.length > 0 });
    addItems(items);
  });

  document.addEventListener('keydown', function(e) {
    if (e.keyCode == 8) { removeSelectionItems(); } // backspace
    if (e.keyCode == 189) { decreaseFontSize(); } // -
    if (e.keyCode == 187) { increaseFontSize(); } // +
    if (e.keyCode == 65 && e.metaKey) { selectAll(); } // ⌘A
    if (e.keyCode == 67) { toggleColorOfSelections(); } // c
  }, false);
})();

function setupBackgroundObjects() {
  var xLine = new fabric.Arrow(
    [10, canvas.height / 2, canvas.width - 30, canvas.height / 2],
    {
      stroke: '#000',
      evented: false,
      selectable: false
    }
  );
  var yLine = new fabric.Arrow(
    [canvas.width / 2, canvas.height - 10, canvas.width / 2, 30],
    {
      stroke: '#000',
      evented: false,
      selectable: false
    }
  );
  canvas.add(xLine, yLine);

  var xLeftLabel = new fabric.IText(
    'コスト大',
    {
      left: 20,
      top: xLine.top - 30,
      fontSize: 20,
      hasControls: false
    }
  );
  var xRightLabel = new fabric.IText(
    'コスト小',
    {
      left: canvas.width - 120,
      top: xLine.top - 30,
      fontSize: 20,
      hasControls: false
    }
  );
  var yTopLabel = new fabric.IText(
    '効果大',
    {
      left: yLine.left + 10,
      top: 50,
      fontSize: 20,
      hasControls: false
    }
  );
  var yBottomLabel = new fabric.IText(
    '効果小',
    {
      left: yLine.left + 10,
      top: canvas.height - 50,
      fontSize: 20,
      hasControls: false
    }
  );
  canvas.add(xLeftLabel, xRightLabel, yTopLabel, yBottomLabel);
}

function addItems(items) {
  function random(min, max) { return min + Math.floor(Math.random() * (max - min)) }

  for (var item of items) {
    text = item.match(/.{1,10}/g).join('\n　 ');
    var rect = new fabric.IText(
      '● ' + text,
      {
        left: random(canvas.width * 1 / 5 - 100, canvas.width * 4 / 5 - 100),
        top: random(canvas.height * 1 / 5 - 40, canvas.height * 4 / 5 - 40),
        fontSize: 20,
        fontFamily: 'monospace',
        hasRotatingPoint: false,
        lockScalingFlip: true,
        lockRotation: true,
        lockUniScaling: true
      }
    );
    canvas.add(rect);
    allItems.push(rect);
  }
}

function removeSelectionItems() {
  let itemsToRemove;
  if (canvas.getActiveObject().getObjects) {
    itemsToRemove = canvas.getActiveObject().getObjects();
  } else {
    itemsToRemove = canvas.getActiveObjects();
  }
  itemsToRemove = [].concat(itemsToRemove);
  itemsToRemove.forEach(function (item) {
    canvas.remove(item);
    allItems.splice(allItems.indexOf(item), 1);
  });
  canvas.discardActiveObject();
  canvas.renderAll();
}

function increaseFontSize() {
  allItems.forEach(function (item) {
    item.fontSize += 1;
  });
  canvas.renderAll();
}

function decreaseFontSize() {
  allItems.forEach(function (item) {
    item.fontSize -= 1;
  });
  canvas.renderAll();
}

function toggleColorOfSelections() {
  let selectedItems;
  if (canvas.getActiveObject().getObjects) {
    selectedItems = canvas.getActiveObject().getObjects();
  } else {
    selectedItems = canvas.getActiveObjects();
  }
  selectedItems.forEach(function (item) {
    const lightColor = '#aaa';
    const darkColor = '#000';
    if (item.getCurrentCharColor() != lightColor) {
      item.setColor(lightColor);
    } else {
      item.setColor(darkColor);
    }
  });
  canvas.renderAll();
}

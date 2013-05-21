describe('Core_beforeKeyDown', function () {
  var id = 'testContainer';

  beforeEach(function () {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function () {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('should run beforeKeyDown hook', function () {
    var called = false;

    handsontable({
      data : [[1,2,3,4,5],[1,2,3,4,5]],
      beforeKeyDown: function (event) {
        called = true;
      }
    });
    selectCell(0,0);

    runs(function () {
      this.$container.trigger('keydown');
    });

    waitsFor(function () {
      return (called != false)
    }, "beforeKeyDown callback called", 100);

    runs(function () {
      expect(called).toEqual(true);
    });
  });

  it('should prevent hook fron runing default action', function () {
    var called = false;

    handsontable({
      data : [[1,2,3,4,5],[1,2,3,4,5]],
      beforeKeyDown: function (event) {
        event.stopImmediatePropagation();
        called = true;
      }
    });
    selectCell(0,0);

    runs(function () {
      var e = jQuery.Event('keydown');
      e.keyCode = 39;
      this.$container.trigger(e);
    });

    waitsFor(function () {
      return (called != false)
    }, "beforeKeyDown callback called", 100);

    runs(function () {
      expect(getSelected()).toEqual([0,0,0,0]);
      expect(getSelected()).not.toEqual([0,1,0,1]);
    });
  });

  it('should overwrite default behavior of delete key, but not this of right arrow', function () {
    var called = 0;

    handsontable({
      data : [[1,2,3,4,5],[1,2,3,4,5]],
      beforeKeyDown: function (event) {
        if (event.keyCode === 8) {
          event.stopImmediatePropagation();
          getInstance().alter('insert_row', 1, 1);
        }

        called++;
      }
    });

    selectCell(0,0);

    runs(function () {
      var e;

      /// Backspace
      e = jQuery.Event('keydown');

      e.keyCode = 8;
      this.$container.trigger(e);

      /// Arrow right
      e = jQuery.Event('keydown');

      e.keyCode = 39;
      this.$container.trigger(e);
    });

    waitsFor(function () {
      return (called > 1)
    }, "beforeKeyDown callback called", 100);

    runs(function () {
      expect(getData().length).toEqual(3);
      expect(getSelected()).toEqual([0,1,0,1]);
    });
  });

});
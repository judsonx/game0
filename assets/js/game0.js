var game0 = (function ($, document) {
  var COLS = 10;
  var ROWS = 20;

  var CELL_EMPTY = 0;
  var CELL_S0 = 1;
  var CELL_S1 = 2;
  var CELL_S2 = 3;
  var CELL_S3 = 4;
  var CELL_S4 = 5;

  var game_area_e_;
  var preview_area_e_;
  var state_;
  var pos_ = { x: -1, y: -1 };
  var next_shape_ = 0;
  var current_shape_ = 0;
  var orientation_ = 0;
  var score_ = 0;
  var lines_ = 0;
  var paused_ = true;

  var shape0_ = {
    index: CELL_S0,
    size: { x: 2, y: 2 },
    grid: [
      [1, 1],
      [1, 1]
    ],
    offset: { x: 0, y: 1 }
  };
  var shape1_0_ = {
    index: CELL_S1,
    size: { x: 3, y: 2 },
    grid: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    offset: { x: 1, y: 1 }
  };
  var shape1_1_ = {
    index: CELL_S1,
    size: { x: 2, y: 3 },
    grid: [
      [1, 0],
      [1, 1],
      [1, 0]
    ],
    offset: { x: 0, y: 1 }
  };
  var shape1_2_ = {
    index: CELL_S1,
    size: { x: 3, y: 2 },
    grid: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    offset: { x: 1, y: 0 }
  };
  var shape1_3_ = {
    index: CELL_S1,
    size: { x: 2, y: 3 },
    grid: [
      [0, 1],
      [1, 1],
      [0, 1]
    ],
    offset: { x: 1, y: 1 }
  };
  var shape2_0_ = {
    index: CELL_S2,
    size: { x: 2, y: 3 },
    grid: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    offset: { x: 0, y: 1 }
  };
  var shape2_1_ = {
    index: CELL_S2,
    size: { x: 3, y: 2 },
    grid: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    offset: { x: 1, y: 0 }
  };
  var shape2_2_ = {
    index: CELL_S2,
    size: { x: 2, y: 3 },
    grid: [
      [1, 1],
      [0, 1],
      [0, 1]
    ],
    offset: { x: 1, y: 1 }
  };
  var shape2_3_ = {
    index: CELL_S2,
    size: { x: 3, y: 2 },
    grid: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    offset: { x: 1, y: 0 }
  };
  var shape3_0_ = {
    index: CELL_S3,
    size: { x: 2, y: 3 },
    grid: [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    offset: { x: 1, y: 1 }
  };
  var shape3_1_ = {
    index: CELL_S3,
    size: { x: 3, y: 2 },
    grid: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    offset: { x: 1, y: 0 }
  };
  var shape3_2_ = {
    index: CELL_S3,
    size: { x: 2, y: 3 },
    grid: [
      [1, 1],
      [1, 0],
      [1, 0]
    ],
    offset: { x: 0, y: 1 }
  };
  var shape3_3_ = {
    index: CELL_S3,
    size: { x: 3, y: 2 },
    grid: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    offset: { x: 1, y: 0 }
  };
  var shape4_0_ = {
    index: CELL_S4,
    size: { x: 4, y: 2 },
    grid: [
      [ 1, 1, 1, 1],
      [ 0, 0, 0, 0],
    ],
    offset: { x: 1, y: 0 }
  };
  var shape4_1_ = {
    index: CELL_S4,
    size: { x: 1, y: 4 },
    grid: [
      [1], [1], [1], [1]
    ],
    offset: { x: 0, y: 3 }
  };

  var shapes_ = [
    [ shape0_ ],
    [ shape1_0_, shape1_1_, shape1_2_, shape1_3_ ],
    [ shape2_0_, shape2_1_, shape2_2_, shape2_3_ ],
    [ shape3_0_, shape3_1_, shape3_2_, shape3_3_ ],
    [ shape4_0_, shape4_1_ ]
  ];

  function get_next_shape ()
  {
    return Math.floor (Math.random () * shapes_.length);
  }

  function current_shape ()
  {
    return shapes_[current_shape_][orientation_];
  }

  function create_empty_state ()
  {
    var out = [];
    for (var i = 0; i < ROWS; ++i)
    {
      var row = [];
      for (var j = 0; j < COLS; ++j)
      {
        row.push (CELL_EMPTY);
      }
      out.push (row);
    }
    return out;
  }

  function reset_pos ()
  {
    var offset = shapes_[current_shape_][0].size.y - 1;
    pos_ = { x: Math.floor (COLS / 2), y: -1 * offset };
  }

  function build_grid (element, N_ROWS, N_COLS)
  {
    for (var i = 0; i < N_ROWS; ++i)
    {
      var row = $(document.createElement ('div')).prop ({class: 'row'});
      for (var j = 0; j < N_COLS; ++j)
      {
        $(document.createElement ('div')).appendTo (row);
      }
      row.appendTo (element);
    }
  }

  function init_ga (game_area_e)
  {
    build_grid (game_area_e, ROWS, COLS);
    game_area_e_ = game_area_e;
  }

  function init_pa (preview_area_e)
  {
    var PREVIEW_SIZE = 4;
    build_grid (preview_area_e, PREVIEW_SIZE, PREVIEW_SIZE);
    preview_area_e_ = preview_area_e;
  }

  function update_preview (shape_index)
  {
    var shape = shapes_[shape_index][0];
    preview_area_e_.children ().each (function (row_index, row_div) {
      $(row_div).children ().each (function (col_index, cell_div) {
        var value = CELL_EMPTY;
        if (row_index < shape.size.y && col_index <= shape.size.x)
        {
          if (shape.grid[row_index][col_index])
            value = shape.index;
        }
        update_cell ($(cell_div), value);
      })
    });
  }

  function reset ()
  {
    state_ = create_empty_state ();
    next_shape_ = get_next_shape ();
    current_shape_ = get_next_shape ();
    orientation_ = 0;
    score_ = 0;
    lines_ = 0;
    update_preview (next_shape_);
    reset_pos ();
    update_game (state_, state_);
  }

  function init (config)
  {
    init_ga (config.game_area);
    init_pa (config.preview_area);
  }

  function update_cell (element, id)
  {
    element.removeClass ('s0 s1 s2 s3 s4');
    var map = [
      function (e) {},
      function (e) { e.addClass ('s0'); },
      function (e) { e.addClass ('s1'); },
      function (e) { e.addClass ('s2'); },
      function (e) { e.addClass ('s3'); },
      function (e) { e.addClass ('s4'); },
    ];

    map[id] (element);
  }

  function update_game (state0, state1)
  {
    game_area_e_.children ().each (function (row_index, row_div) {
       $(row_div).children ().each (function (col_index, cell_div) {
         if (state0[row_index][col_index])
           update_cell ($(cell_div), state0[row_index][col_index]);
         else
           update_cell ($(cell_div), state1[row_index][col_index]);
       })
    });
  }

  function place_shape (state0, state, shape, pos)
  {
    var count = 0;
    for (var i = 0; i < shape.size.y; ++i)
    {
      for (var j = 0; j < shape.size.x; ++j)
      {
        if (shape.grid[i][j])
        {
          var x = pos.x + j - shape.offset.x;
          var y = pos.y + i - shape.offset.y;
          if (x < 0)
            return false;
          if (y < 0)
            continue;
          if (x >= state[0].length || y >= state.length)
            return false;
          if (state0[y][x])
            return false;

          state[y][x] = shape.index;
          ++count;
        }
      }
    }
    return count > 0;
  }

  function step ()
  {
    var next_pos = { x: pos_.x, y: pos_.y + 1 };
    var state = create_empty_state ();
    var shape = current_shape ();
    if (place_shape (state_, state, shape, next_pos))
    {
      pos_ = next_pos;
      update_game (state_, state);
      return true;
    }

    if (!place_shape (state_, state_, shape, pos_))
      return false;

    orientation_ = 0;
    current_shape_ = next_shape_;
    next_shape_ = get_next_shape ();
    update_preview (next_shape_);
    reset_pos ();
    var result = clear_full_rows (state_);
    state_ = result.state;
    score_ += Math.pow (result.count, 2);
    lines_ += result.count;

    return true;
  }

  function get_next_orientation (shape_index, orientation)
  {
    if (orientation + 1 >= shapes_[shape_index].length)
    {
      return 0;
    }

    return orientation + 1;
  }

  function toggle_orientation ()
  {
    var try_orientation = get_next_orientation (current_shape_, orientation_);
    var state = create_empty_state ();
    var shape = shapes_[current_shape_][try_orientation];
    if (place_shape (state_, state, shape, pos_))
    {
      update_game (state_, state);
      orientation_ = try_orientation;
    }
  }

  function on_ctrl_left ()
  {
    if (paused_)
      return;

    var state = create_empty_state ();
    var try_pos = { x: pos_.x - 1, y: pos_.y };
    if (place_shape (state_, state, current_shape (), try_pos))
    {
      update_game (state_, state);
      pos_.x -= 1;
    }
  }

  function on_ctrl_right ()
  {
    if (paused_)
      return;

    var state = create_empty_state ();
    var try_pos = { x: pos_.x + 1, y: pos_.y };
    if (place_shape (state_, state, current_shape (), try_pos))
    {
      update_game (state_, state);
      pos_.x += 1;
    }
  }

  function on_ctrl_down ()
  {
    if (!paused_)
      step ();
  }

  function on_ctrl_toggle ()
  {
    if (!paused_)
      toggle_orientation ();
  }

  function is_full_row (row)
  {
    for (var i = 0; i < COLS; ++i)
    {
      if (!row[i])
        return false;
    }
    return true;
  }

  function clear_full_rows (state)
  {
    var count = 0;
    var out = [];
    for (var i = ROWS - 1; i >= 0; --i)
    {
      if (!is_full_row (state[i]))
      {
        out.push (state[i]);
      }
      else
      {
        ++count;
      }
    }

    for (var j = out.length; j < ROWS; ++j)
    {
      var row = [];
      for (var k = 0; k < COLS; ++k)
        row.push (CELL_EMPTY);
      out.push (row);
    }

    out.reverse ();
    return { state: out, count: count };
  }

  function get_score ()
  {
    return score_;
  }

  function get_lines ()
  {
    return lines_;
  }

  function set_paused (paused)
  {
    paused_ = paused;
  }

  return {
    init: init,
    step: step,
    on_ctrl_left: on_ctrl_left,
    on_ctrl_right: on_ctrl_right,
    on_ctrl_toggle: on_ctrl_toggle,
    on_ctrl_down: on_ctrl_down,
    reset: reset,
    get_score: get_score,
    get_lines: get_lines,
    set_paused: set_paused
  };
} (jQuery, document));

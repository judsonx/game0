var game0 = (function ($, document) {
  var COLS;
  var ROWS;

  var CELL_EMPTY = 0;
  var CELL_S0 = 1;
  var CELL_S1 = 2;
  var CELL_S2 = 3;
  var CELL_S3 = 4;
  var CELL_S4 = 5;

  var state_;
  var pos_ = { x: -1, y: -1 };
  var next_shape_ = 0;
  var current_shape_ = 0;
  var orientation_ = 0;
  var score_ = 0;
  var lines_ = 0;

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

  function reset ()
  {
    state_ = create_empty_state ();
    next_shape_ = get_next_shape ();
    current_shape_ = get_next_shape ();
    orientation_ = 0;
    score_ = 0;
    lines_ = 0;
    update_preview_cb (shapes_[next_shape_][0]);
    reset_pos ();
    update_game_cb (state_, state_);
    return { score: score_, lines: lines_ };
  }

  function init (config)
  {
    update_preview_cb = config.preview_cb;
    update_game_cb = config.game_cb;
    ROWS = config.n_rows;
    COLS = config.n_cols;
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
      update_game_cb (state_, state);

      return { score: score_, lines: lines_, done: false };
    }

    if (!place_shape (state_, state_, shape, pos_))
    {
      return { score: score_, lines: lines_, done: true };
    }

    orientation_ = 0;
    current_shape_ = next_shape_;
    next_shape_ = get_next_shape ();
    var shape = shapes_[next_shape_][0];
    update_preview_cb (shape);
    reset_pos ();
    var count = clear_full_rows (state_);
    if (count)
      update_game_cb (state_, state_);
    score_ += Math.pow (count, 2);
    lines_ += count;

    return { score: score_, lines: lines_, done: false };
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
      update_game_cb (state_, state);
      orientation_ = try_orientation;
    }
  }

  function on_ctrl_left ()
  {
    var state = create_empty_state ();
    var try_pos = { x: pos_.x - 1, y: pos_.y };
    if (place_shape (state_, state, current_shape (), try_pos))
    {
      update_game_cb (state_, state);
      pos_.x -= 1;
    }
  }

  function on_ctrl_right ()
  {
    var state = create_empty_state ();
    var try_pos = { x: pos_.x + 1, y: pos_.y };
    if (place_shape (state_, state, current_shape (), try_pos))
    {
      update_game_cb (state_, state);
      pos_.x += 1;
    }
  }

  function on_ctrl_down ()
  {
    step ();
  }

  function on_ctrl_toggle ()
  {
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

  function remove_row (state, row)
  {
    for (var i = row; i > 0; --i)
      state[i] = state[i-1];
    var empty_row = [];
    for (var j = 0; j < COLS; ++j)
      empty_row[j] = CELL_EMPTY;

    state[0] = empty_row;
  }

  function clear_full_rows (state)
  {
    var count = 0;
    for (var i = ROWS - 1; i >= 0; --i)
    {
      if (is_full_row (state[i]))
      {
        remove_row (state, i);
        ++i;
        ++count;
      }
    }

    return count;
  }

  return {
    init: init,
    step: step,
    on_ctrl_left: on_ctrl_left,
    on_ctrl_right: on_ctrl_right,
    on_ctrl_toggle: on_ctrl_toggle,
    on_ctrl_down: on_ctrl_down,
    reset: reset,
  };
} (jQuery, document));

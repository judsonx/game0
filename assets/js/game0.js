var game0 = (function ($, document) {
  var COLS = 10;
  var ROWS = 20;
  var N_SHAPES = 3;

  var CELL_EMPTY = 0;
  var CELL_S0 = 1;
  var CELL_S1 = 2;
  var CELL_S2 = 3;

  var game_area_e_;
  var preview_area_e_;
  var state_;
  var pos_ = { x: -1, y: -1 };
  var next_shape_ = 0;
  var current_shape_ = 0;
  var orientation_ = 0;

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
    offset: { x: 1, y: 1 }
  };
  var shape1_2_ = {
    index: CELL_S1,
    size: { x: 3, y: 2 },
    grid: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    offset: { x: 1, y: 1 }
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
    offset: { x: 1, y: 1 }
  };
  var shape2_1_ = {
    index: CELL_S2,
    size: { x: 3, y: 2 },
    grid: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    offset: { x: 1, y: 1 }
  };
  var shape2_2_ = {
    index: CELL_S2,
    size: { x: 2, y: 3 },
    grid: [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    offset: { x: 1, y: 1 }
  };
  var shape2_3_ = {
    index: CELL_S2,
    size: { x: 3, y: 2 },
    grid: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    offset: { x: 1, y: 1 }
  };

  var shapes_ = [
    [ shape0_ ],
    [ shape1_0_, shape1_1_, shape1_2_, shape1_3_ ],
    [ shape2_0_, shape2_1_, shape2_2_, shape2_3_ ]
  ];

  function get_next_shape ()
  {
    return Math.floor (Math.random () * N_SHAPES);
  }

  function current_shape ()
  {
    var shape = shapes_[current_shape_][orientation_];
    if (!shape)
    {
      console.log ('Invalid shape');
    }
    return shape;
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
    pos_ = { x: Math.floor (COLS / 2), y: -1 };
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
    var PREVIEW_SIZE = 5;
    build_grid (preview_area_e, PREVIEW_SIZE, PREVIEW_SIZE);
    preview_area_e_ = preview_area_e;
  }

  function init (config)
  {
    init_ga (config.game_area);
    init_pa (config.preview_area);
    state_ = create_empty_state ();
    reset_pos ();
    next_shape_ = get_next_shape ();
    current_shape_ = get_next_shape ();
  }

  function update_state (state)
  {
    for (var i = 0; i < ROWS; ++i)
    {
      for (var j = 0; j < COLS; ++j)
      {
        if (state[i][j])
          state_[i][j] = state[i][j];
      }
    }
  }

  function update_cell (element, id)
  {
    element.removeClass ('s0 s1 s2');
    var map = [
      function (e) {},
      function (e) { e.addClass ('s0'); },
      function (e) { e.addClass ('s1'); },
      function (e) { e.addClass ('s2'); }
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

  function place_shape (state, shape, pos)
  {
    var rv = true;
    for (var i = 0; i < shape.size.y; ++i)
    {
      for (var j = 0; j < shape.size.x; ++j)
      {
        if (shape.grid[i][j])
        {
          var x = pos.x + j - shape.offset.x;
          var y = pos.y + i - shape.offset.y;
          if (x < 0)
          {
            rv = false;
            continue;
          }
          if (y < 0)
          {
            continue;
          }
          if (x >= state[0].length || y >= state.length)
          {
            rv = false;
            continue;
          }
          state[y][x] = shape.index;
        }
      }
    }
    return rv;
  }

  function check_step (state)
  {
    for (var i = 0; i < ROWS; ++i)
    {
      for (var j = 0; j < COLS; ++j)
      {
        if (state[i][j] && state_[i][j])
        {
          return false;
        }
      }
    }
    return true;
  }

  function step ()
  {
    var next_pos = { x: pos_.x, y: pos_.y + 1 };
    var state = create_empty_state ();
    var shape = current_shape ();
    if (place_shape (state, shape, next_pos) && check_step (state))
    {
      pos_ = next_pos;
      update_game (state_, state);
      return true;
    }

    if (pos_.y < 0)
      return false;

    place_shape (state_, shape, pos_)
    orientation_ = 0;
    current_shape_ = next_shape_;
    next_shape_ = get_next_shape ();
    reset_pos ();

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
    if (place_shape (state, shape, pos_) && check_step (state))
    {
      update_game (state_, state);
      orientation_ = try_orientation;
    }
  }

  function on_ctrl_left ()
  {
    var state = create_empty_state ();
    var try_pos = { x: pos_.x - 1, y: pos_.y };
    if (place_shape (state, current_shape (), try_pos))
    {
      if (check_step (state))
      {
        update_game (state_, state);
        pos_.x -= 1;
      }
    }
  }

  function on_ctrl_right ()
  {
    var state = create_empty_state ();
    var try_pos = { x: pos_.x + 1, y: pos_.y };
    if (place_shape (state, current_shape (), try_pos))
    {
      if (check_step (state))
      {
        update_game (state_, state);
        pos_.x += 1;
      }
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

  return {
    init: init,
    step: step,
    on_ctrl_left: on_ctrl_left,
    on_ctrl_right: on_ctrl_right,
    on_ctrl_toggle: on_ctrl_toggle,
    on_ctrl_down: on_ctrl_down
  };
} (jQuery, document));

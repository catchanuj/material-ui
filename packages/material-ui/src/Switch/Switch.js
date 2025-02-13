// @inheritedComponent IconButton
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { refType, deepmerge } from '@material-ui/utils';
import { unstable_composeClasses as composeClasses } from '@material-ui/unstyled';
import { alpha, darken, lighten } from '../styles/colorManipulator';
import capitalize from '../utils/capitalize';
import SwitchBase from '../internal/SwitchBase';
import useThemeProps from '../styles/useThemeProps';
import experimentalStyled, { shouldForwardProp } from '../styles/experimentalStyled';
import switchClasses, { getSwitchUtilityClass } from './switchClasses';

const overridesResolver = (props, styles) => {
  const { styleProps } = props;

  return deepmerge(
    {
      ...(styleProps.edge && styles[`edge${capitalize(styleProps.edge)}`]),
      ...styles[`size${capitalize(styleProps.size)}`],
      [`& .${switchClasses.switchBase}`]: {
        ...styles.switchBase,
        ...styles.input,
        ...(styleProps.color !== 'default' && styles[`color${capitalize(styleProps.color)}`]),
      },
      [`& .${switchClasses.thumb}`]: styles.thumb,
      [`& .${switchClasses.track}`]: styles.track,
    },
    styles.root || {},
  );
};

const useUtilityClasses = (styleProps) => {
  const { classes, edge, size, color, checked, disabled } = styleProps;

  const slots = {
    root: ['root', edge && `edge${capitalize(edge)}`, `size${capitalize(size)}`],
    switchBase: [
      'switchBase',
      `color${capitalize(color)}`,
      checked && 'checked',
      disabled && 'disabled',
    ],
    thumb: ['thumb'],
    track: ['track'],
    input: ['input'],
  };

  const composedClasses = composeClasses(slots, getSwitchUtilityClass, classes);

  return {
    ...classes, // forward the disabled and checked classes to the SwitchBase
    ...composedClasses,
  };
};

const SwitchRoot = experimentalStyled(
  'span',
  {},
  {
    name: 'MuiSwitch',
    slot: 'Root',
    overridesResolver,
  },
)(({ styleProps }) => ({
  /* Styles applied to the root element. */
  display: 'inline-flex',
  width: 34 + 12 * 2,
  height: 14 + 12 * 2,
  overflow: 'hidden',
  padding: 12,
  boxSizing: 'border-box',
  position: 'relative',
  flexShrink: 0,
  zIndex: 0, // Reset the stacking context.
  verticalAlign: 'middle', // For correct alignment with the text.
  '@media print': {
    colorAdjust: 'exact',
  },
  /* Styles applied to the root element if `edge="start"`. */
  ...(styleProps.edge === 'start' && {
    marginLeft: -8,
  }),
  /* Styles applied to the root element if `edge="end"`. */
  ...(styleProps.edge === 'end' && {
    marginRight: -8,
  }),
  ...(styleProps.size === 'small' && {
    width: 40,
    height: 24,
    padding: 7,
    [`& .${switchClasses.thumb}`]: {
      width: 16,
      height: 16,
    },
    [`& .${switchClasses.switchBase}`]: {
      padding: 4,
      [`&.${switchClasses.checked}`]: {
        transform: 'translateX(16px)',
      },
    },
  }),
}));

const SwitchSwitchBase = experimentalStyled(
  SwitchBase,
  { shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes' },
  {
    name: 'MuiSwitch',
    slot: 'SwitchBase',
  },
)(
  ({ theme }) => ({
    /* Styles applied to the internal `SwitchBase` component's `root` class. */
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1, // Render above the focus ripple.
    color: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[300],
    transition: theme.transitions.create(['left', 'transform'], {
      duration: theme.transitions.duration.shortest,
    }),
    [`&.${switchClasses.checked}`]: {
      transform: 'translateX(20px)',
    },
    [`&.${switchClasses.disabled}`]: {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    [`&.${switchClasses.checked} + .${switchClasses.track}`]: {
      opacity: 0.5,
    },
    [`&.${switchClasses.disabled} + .${switchClasses.track}`]: {
      opacity: theme.palette.mode === 'light' ? 0.12 : 0.2,
    },
    [`& .${switchClasses.input}`]: {
      /* Styles applied to the internal SwitchBase component's input element. */
      left: '-100%',
      width: '300%',
    },
  }),
  ({ theme, styleProps }) => ({
    /* Styles applied to the internal SwitchBase component element unless `color="default"`. */
    ...(styleProps.color !== 'default' && {
      [`&.${switchClasses.checked}`]: {
        color: theme.palette[styleProps.color].main,
        '&:hover': {
          backgroundColor: alpha(
            theme.palette[styleProps.color].main,
            theme.palette.action.hoverOpacity,
          ),
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
        [`&.${switchClasses.disabled}`]: {
          color:
            theme.palette.mode === 'light'
              ? lighten(theme.palette[styleProps.color].main, 0.62)
              : darken(theme.palette[styleProps.color].main, 0.55),
        },
      },
      [`&.${switchClasses.checked} + .${switchClasses.track}`]: {
        backgroundColor: theme.palette[styleProps.color].main,
      },
    }),
  }),
);

const SwitchTrack = experimentalStyled(
  'span',
  {},
  {
    name: 'MuiSwitch',
    slot: 'Track',
  },
)(({ theme }) => ({
  /* Styles applied to the track element. */
  height: '100%',
  width: '100%',
  borderRadius: 14 / 2,
  zIndex: -1,
  transition: theme.transitions.create(['opacity', 'background-color'], {
    duration: theme.transitions.duration.shortest,
  }),
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.common.black : theme.palette.common.white,
  opacity: theme.palette.mode === 'light' ? 0.38 : 0.3,
}));

const SwitchThumb = experimentalStyled(
  'span',
  {},
  {
    name: 'MuiSwitch',
    slot: 'Thumb',
  },
)(({ theme }) => ({
  /* Styles used to create the thumb passed to the internal `SwitchBase` component `icon` prop. */
  boxShadow: theme.shadows[1],
  backgroundColor: 'currentColor',
  width: 20,
  height: 20,
  borderRadius: '50%',
}));

const Switch = React.forwardRef(function Switch(inProps, ref) {
  const props = useThemeProps({ props: inProps, name: 'MuiSwitch' });
  const { className, color = 'secondary', edge = false, size = 'medium', ...other } = props;

  const styleProps = {
    ...props,
    color,
    edge,
    size,
  };

  const classes = useUtilityClasses(styleProps);

  const icon = <SwitchThumb className={classes.thumb} styleProps={styleProps} />;

  return (
    <SwitchRoot className={clsx(classes.root, className)} styleProps={styleProps}>
      <SwitchSwitchBase
        className={classes.switchBase}
        type="checkbox"
        icon={icon}
        checkedIcon={icon}
        ref={ref}
        styleProps={styleProps}
        {...other}
        classes={classes}
      />
      <SwitchTrack className={classes.track} styleProps={styleProps} />
    </SwitchRoot>
  );
});

Switch.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * If `true`, the component is checked.
   */
  checked: PropTypes.bool,
  /**
   * The icon to display when the component is checked.
   */
  checkedIcon: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * @default 'secondary'
   */
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  /**
   * The default checked state. Use when the component is not controlled.
   */
  defaultChecked: PropTypes.bool,
  /**
   * If `true`, the component is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the ripple effect is disabled.
   */
  disableRipple: PropTypes.bool,
  /**
   * If given, uses a negative margin to counteract the padding on one
   * side (this is often helpful for aligning the left or right
   * side of the icon with content above or below, without ruining the border
   * size and shape).
   * @default false
   */
  edge: PropTypes.oneOf(['end', 'start', false]),
  /**
   * The icon to display when the component is unchecked.
   */
  icon: PropTypes.node,
  /**
   * The id of the `input` element.
   */
  id: PropTypes.string,
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps: PropTypes.object,
  /**
   * Pass a ref to the `input` element.
   */
  inputRef: refType,
  /**
   * Callback fired when the state is changed.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (string).
   * You can pull out the new checked state by accessing `event.target.checked` (boolean).
   */
  onChange: PropTypes.func,
  /**
   * If `true`, the `input` element is required.
   */
  required: PropTypes.bool,
  /**
   * The size of the component.
   * `small` is equivalent to the dense switch styling.
   * @default 'medium'
   */
  size: PropTypes.oneOf(['medium', 'small']),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.object,
  /**
   * The value of the component. The DOM API casts this to a string.
   * The browser uses "on" as the default value.
   */
  value: PropTypes.any,
};

export default Switch;

/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Constants from "../../../src/configs/Const"
import Text from "../../../src/elements/Text/index"
import { MaterialIcons } from '@expo/vector-icons';
import {theme} from "../../../src/configs/themes"
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { StepIndicatorProps } from './types';
import {reportStatusConfig} from "../../../src/utils/preSurveyConfig/reportStatusConfig"

const STEP_STATUS = {
  CURRENT: 'current',
  FINISHED: 'finished',
  UNFINISHED: 'unfinished',
};

interface DefaultStepIndicatorStyles {
  stepIndicatorSize: number;
  currentStepIndicatorSize: number;
  separatorStrokeWidth: number;
  separatorStrokeUnfinishedWidth: number;
  separatorStrokeFinishedWidth: number;
  currentStepStrokeWidth: number;
  stepStrokeWidth: number;
  stepStrokeCurrentColor: string;
  stepStrokeFinishedColor: string;
  stepStrokeUnFinishedColor: string;
  separatorFinishedColor: string;
  separatorUnFinishedColor: string;
  stepIndicatorFinishedColor: string;
  stepIndicatorUnFinishedColor: string;
  stepIndicatorCurrentColor: string;
  stepIndicatorLabelFontSize: number;
  currentStepIndicatorLabelFontSize: number;
  stepIndicatorLabelCurrentColor: string;
  stepIndicatorLabelFinishedColor: string;
  stepIndicatorLabelUnFinishedColor: string;
  labelColor: string;
  labelSize: number;
  labelAlign:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'stretch'
    | 'baseline'
    | undefined;
  currentStepLabelColor: string;
  labelFontFamily?: string;
  updateMessage?: string;
  updateMessageSize?: number;
  updateMessageFont?: string;
  updateMessageColor?: string;
  updateStatusSize?: number;
  updateStatusFont?: string;
  updateStatusColor?: string;
}

const defaultStyles: DefaultStepIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 3,
  separatorStrokeUnfinishedWidth: 0,
  separatorStrokeFinishedWidth: 0,
  currentStepStrokeWidth: 5,
  stepStrokeWidth: 0,
  stepStrokeCurrentColor: '#4aae4f',
  stepStrokeFinishedColor: '#4aae4f',
  stepStrokeUnFinishedColor: '#4aae4f',
  separatorFinishedColor: '#4aae4f',
  separatorUnFinishedColor: '#a4d4a5',
  stepIndicatorFinishedColor: '#4aae4f',
  stepIndicatorUnFinishedColor: '#a4d4a5',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#000000',
  labelSize: 13,
  labelAlign: 'center',
  currentStepLabelColor: '#4aae4f',
};

const StepIndicator = ({
  currentPosition = 0,
  stepCount = 5,
  direction = 'horizontal',
  customStyles: customStylesFromProps = defaultStyles,
  labels = [],
  onPress,
  renderStepIndicator: renderCustomStepIndicator,
  renderLabel,
}: StepIndicatorProps) => {
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const [progressBarSize, setProgressBarSize] = React.useState<number>(0);
  const [customStyles, setCustomStyles] = React.useState<
    DefaultStepIndicatorStyles
  >({
    ...defaultStyles,
    ...customStylesFromProps,
  });


  // Controls color of progress bar
  const progressBarColor = theme.colors.Blue
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const sizeAnim = React.useRef(
    new Animated.Value(customStyles.stepIndicatorSize)
  ).current;
  const staleSizeAnim = React.useRef(
    new Animated.Value(customStyles.stepIndicatorSize)
  ).current;
  const borderRadiusAnim = React.useRef(
    new Animated.Value(customStyles.stepIndicatorSize / 2)
  ).current;

  const stepPressed = (position: number) => {
    if (onPress) {
      onPress(position);
    }
  };

  const effectCustomStyles = () => {
    setCustomStyles({ ...customStyles, ...customStylesFromProps });
  };
  React.useEffect(effectCustomStyles, [customStylesFromProps]);

  const effectCurrentPosition = () => {
    onCurrentPositionChanged(currentPosition);
  };
  React.useEffect(effectCurrentPosition, [currentPosition, progressBarSize]);

  const renderProgressBarBackground = () => {
    let progressBarBackgroundStyle: ViewStyle = {
      backgroundColor: progressBarColor,
      position: 'absolute',
    };
    if (direction === 'vertical') {
      progressBarBackgroundStyle = {
        ...progressBarBackgroundStyle,
        left: (width - customStyles.separatorStrokeWidth) / 2,
        top: height / (2 * stepCount),
        bottom: height / (2 * stepCount),
        width:
          customStyles.separatorStrokeUnfinishedWidth === 0
            ? customStyles.separatorStrokeWidth
            : customStyles.separatorStrokeUnfinishedWidth,
      };
    } else {
      progressBarBackgroundStyle = {
        ...progressBarBackgroundStyle,
        top: (height - customStyles.separatorStrokeWidth) / 2,
        left: width / (2 * stepCount),
        right: width / (2 * stepCount),
        height:
          customStyles.separatorStrokeUnfinishedWidth === 0
            ? customStyles.separatorStrokeWidth
            : customStyles.separatorStrokeUnfinishedWidth,
      };
    }
    return (
      <View
        onLayout={(event) => {
          if (direction === 'vertical') {
            setProgressBarSize(event.nativeEvent.layout.height);
          } else {
            setProgressBarSize(event.nativeEvent.layout.width);
          }
        }}
        style={progressBarBackgroundStyle}
      />
    );
  };

  const renderProgressBar = () => {
    // const lengthLabels = labels.length
    // const lastReportStatus = labels[lengthLabels-1]['status']
    // const lastReportStatusMsg = labels[lengthLabels-1]['statusMessage']
    let progressBarCol = progressBarColor;
//     if (lastReportStatus === reportStatusConfig.completedReport.status) {
//       progressBarCol = theme.colors.Success
//     } else if (lastReportStatus === reportStatusConfig.lateReport.status.lateReport && lastReportStatusMsg == reportStatusConfig.veryLateReport.statusMsg.singleLate) {
//       progressBarCol = theme.colors.Error
//     } else if (lastReportStatus === reportStatusConfig.lateReport.status.lateReport) {
//       progressBarCol = theme.colors.Warning
//     }
//  else if (lastReportStatus === reportStatusConfig.upcomingReport.status.incomplete) {
//   progressBarCol = theme.colors.Blue
//     } else if (lastReportStatus === reportStatusConfig.upcomingReport.status.pendingMUlti || lastReportStatus === reportStatusConfig.veryLateReport.status.missedMulti) {
//       progressBarCol = theme.colors.Grey
//     } 

    let progressBarStyle: any = {
      backgroundColor: progressBarCol,
      position: 'absolute',
    };
    if (direction === 'vertical') {
      progressBarStyle = {
        ...progressBarStyle,
        left: (width - customStyles.separatorStrokeWidth) / 2,
        top: height / (2 * stepCount),
        bottom: height / (2 * stepCount),
        width:
          customStyles.separatorStrokeFinishedWidth === 0
            ? customStyles.separatorStrokeWidth
            : customStyles.separatorStrokeFinishedWidth,
        height: progressAnim,
      };
    } else {
      progressBarStyle = {
        ...progressBarStyle,
        top: (height - customStyles.separatorStrokeWidth) / 2,
        left: width / (2 * stepCount),
        right: width / (2 * stepCount),
        height:
          customStyles.separatorStrokeFinishedWidth === 0
            ? customStyles.separatorStrokeWidth
            : customStyles.separatorStrokeFinishedWidth,
        width: progressAnim,
      };
    }
    return <Animated.View style={progressBarStyle} />;
  };

  const renderStepIndicator = () => {
    let steps: any = [];
    labels.map((item:any, idx) => {
      console.log(item)
      let icon;
      if (item.indicator == reportStatusConfig.completedReport.indicator) {
        icon = <MaterialIcons name='check-circle-outline' color={theme.colors.Success} size={Constants.width * 0.08}/>
      } else if (item.indicator == reportStatusConfig.completeNowReport.indicator) {
        icon = <MaterialIcons name='error-outline' color={theme.colors.Blue} size={Constants.width * 0.075}/>
      } else if (item.indicator == reportStatusConfig.pastDueReport.indicator) {
        icon = <MaterialIcons name='error-outline' color={theme.colors.Warning} size={Constants.width * 0.075}/>
      } else if (item.indicator == reportStatusConfig.pendingReport.indicator) {
        icon = <MaterialIcons name='access-time' color={theme.colors.Grey} size={Constants.width * 0.075}/>
      } else if (item.indicator == reportStatusConfig.missedReport.indicator) {
        icon = <MaterialIcons name='error-outline' color={theme.colors.Error} size={Constants.width * 0.075}/>
      }
      
      
      
      // else if (item.status === reportStatusConfig.lateReport.status.lateReport && item.statusMessage == reportStatusConfig.veryLateReport.statusMsg.singleLate) {
      //   icon = <MaterialIcons name='error-outline' color={theme.colors.Error} size={Constants.width * 0.075}/>
      // } else if (item.status === reportStatusConfig.lateReport.status.lateReport) {
      //   icon = <MaterialIcons name='error-outline' color={theme.colors.Warning} size={Constants.width * 0.075}/>
      // } else if (item.status === reportStatusConfig.upcomingReport.status.pendingMUlti) {
      //   icon = <MaterialIcons name='access-time' color={theme.colors.Grey} size={Constants.width * 0.075}/>
      // } else if (idx+1 === currentPosition || item.indicator === reportStatusConfig.upcomingReport.indicator) {
      //   icon = <MaterialIcons name='access-time' color={theme.colors.Blue} size={Constants.width * 0.075}/>
      // } else if (item.status === reportStatusConfig.upcomingReport.status.incomplete) {
      //   icon = <MaterialIcons name='error-outline' color={theme.colors.Error} size={Constants.width * 0.075}/>
      // } else if (item.status === reportStatusConfig.veryLateReport.status.missedMulti) {
      //   icon = <MaterialIcons name='error-outline' color={theme.colors.Grey} size={Constants.width * 0.075}/>
      // }
      steps.push(
        <TouchableWithoutFeedback
          key={idx}
        >
          <View
            style={[
              styles.stepContainer,
              direction === 'vertical'
                ? { flexDirection: 'column' }
                : { flexDirection: 'row' },
            ]}
          >
            <View style={{backgroundColor: 'white'}}>{icon}</View>
           
          </View>
        </TouchableWithoutFeedback>
      );
    })
    return (
      <View
        onLayout={(event) => {
          setWidth(event.nativeEvent.layout.width);
          setHeight(event.nativeEvent.layout.height);
        }}
        style={[
          styles.stepIndicatorContainer,
          direction === 'vertical'
            ? {
                flexDirection: 'column',
                width: customStyles.currentStepIndicatorSize,
              }
            : {
                flexDirection: 'row',
                height: customStyles.currentStepIndicatorSize,
              },
        ]}
      >
        {steps}
      </View>
    );
  };

  const renderStepLabels = () => {
    if (!labels || labels.length === 0) {
      return;
    }
    var labelViews = labels.map((label: any, index) => {
      const selectedStepLabelStyle =
        index === currentPosition
          ? { color: customStyles.currentStepLabelColor }
          : { color: customStyles.labelColor };

          // Message for each report label
          const reportStatus: string = label.status;
          const reportStatusMsg: string = label.statusMessage;
          const reportIndicator: string = label.indicator
          console.log(reportIndicator)

          // Colour for each report label
          let labelColor: string = theme.colors.Grey;
          if (reportIndicator === reportStatusConfig.completedReport.indicator) {
            labelColor = theme.colors.Success
          } else if (reportIndicator === reportStatusConfig.completeNowReport.indicator) {
            labelColor = theme.colors.Blue
          } else if (reportIndicator === reportStatusConfig.pastDueReport.indicator) {
            labelColor = theme.colors.Warning
          } else if (reportIndicator === reportStatusConfig.pendingReport.indicator) {
            labelColor = theme.colors.Grey
          } else if (reportIndicator === reportStatusConfig.missedReport.indicator) {
            labelColor = theme.colors.Grey
          }

      return (
        <TouchableWithoutFeedback
          style={styles.stepLabelItem}
          key={index}
          onPress={() => stepPressed(index)}
        >
          <View style={styles.stepLabelItem}>
            {renderLabel ? (
              renderLabel({
                position: index,
                stepStatus: getStepStatus(index),
                label,
                currentPosition,
              })
            ) : (
              <View style={{
                display: 'flex', 
              flexDirection: 'row', 
              //backgroundColor: 'yellow', 
              width: Constants.width * 0.6,
              justifyContent: 'space-between',
              alignItems: 'center'
              }}>
              <Text
                style={[
                  styles.stepLabel,
                  selectedStepLabelStyle,
                  {
                    fontSize: customStyles.labelSize,
                    fontFamily: customStyles.labelFontFamily,
                    color: labelColor
                  },
                ]}
              >
                {label.report}
              </Text>
              <View style={{alignItems: 'flex-start', flex: 1}}>
                <Text style={{
                  fontSize: customStyles.updateStatusSize, 
                  fontFamily: customStyles.updateStatusFont, 
                  color: labelColor, 
                  marginLeft: 5}}>
                  {reportStatus}
                  </Text>
                <Text style={{
                  fontSize: customStyles.updateMessageSize, 
                  fontFamily: customStyles.updateMessageFont, 
                  color: labelColor, 
                  marginLeft: 5}}>
                  {reportStatusMsg}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    });

    return (
      <View
        style={[
          styles.stepLabelsContainer,
          direction === 'vertical'
            ? { flexDirection: 'column', paddingHorizontal: 4 }
            : { flexDirection: 'row', paddingVertical: 4 },
          { alignItems: customStyles.labelAlign },
        ]}
      >
        {labelViews}
      </View>
    );
  };

  
  const renderStep = (position: number) => {
    let stepStyle:any;
    let indicatorLabelStyle: TextStyle = {};
    switch (getStepStatus(position)) {
      case STEP_STATUS.CURRENT: {
        stepStyle = {
          backgroundColor: customStyles.stepIndicatorCurrentColor,
          borderWidth: customStyles.currentStepStrokeWidth,
          borderColor: customStyles.stepStrokeCurrentColor,
          height: sizeAnim,
          width: sizeAnim,
          borderRadius: borderRadiusAnim,
          overflow: 'hidden',
        };
        indicatorLabelStyle = {
          overflow: 'hidden',
          fontSize: customStyles.currentStepIndicatorLabelFontSize,
          color: customStyles.stepIndicatorLabelCurrentColor,
        };

        break;
      }
      case STEP_STATUS.FINISHED: {
        stepStyle = {
          backgroundColor: customStyles.stepIndicatorFinishedColor,
          borderWidth: customStyles.stepStrokeWidth,
          borderColor: customStyles.stepStrokeFinishedColor,
          height: staleSizeAnim,
          width: staleSizeAnim,
          borderRadius: customStyles.stepIndicatorSize / 2,
          overflow: 'hidden',
        };
        indicatorLabelStyle = {
          overflow: 'hidden',
          fontSize: customStyles.stepIndicatorLabelFontSize,
          color: customStyles.stepIndicatorLabelFinishedColor,
        };
        break;
      }

      case STEP_STATUS.UNFINISHED: {
        stepStyle = {
          backgroundColor: customStyles.stepIndicatorUnFinishedColor,
          borderWidth: customStyles.stepStrokeWidth,
          borderColor: customStyles.stepStrokeUnFinishedColor,
          height: staleSizeAnim,
          width: staleSizeAnim,
          borderRadius: customStyles.stepIndicatorSize / 2,
          overflow: 'hidden',
        };
        indicatorLabelStyle = {
          overflow: 'hidden',
          fontSize: customStyles.stepIndicatorLabelFontSize,
          color: customStyles.stepIndicatorLabelUnFinishedColor,
        };
        break;
      }
      default:
    }

    return (
      <Animated.View key={'step-indicator'} style={[styles.step, stepStyle]}>
        {renderCustomStepIndicator ? (
          renderCustomStepIndicator({
            position,
            stepStatus: getStepStatus(position),
          })
        ) : (
          <Text style={indicatorLabelStyle}>{5}</Text>
        )}
      </Animated.View>
    );
  };

  const getStepStatus = (stepPosition: number) => {
    if (stepPosition === currentPosition) {
      return STEP_STATUS.CURRENT;
    } else if (stepPosition < currentPosition) {
      return STEP_STATUS.FINISHED;
    } else {
      return STEP_STATUS.UNFINISHED;
    }
  };

  const onCurrentPositionChanged = (position: number) => {
    if (position > stepCount - 1) {
      position = stepCount - 1;
    }
    const animateToPosition = (progressBarSize / (stepCount - 1)) * position;
    sizeAnim.setValue(customStyles.stepIndicatorSize);
    staleSizeAnim.setValue(customStyles.stepIndicatorSize);
    borderRadiusAnim.setValue(customStyles.stepIndicatorSize / 2);
    Animated.sequence([
      Animated.timing(progressAnim, {
        toValue: isNaN(animateToPosition) ? 0 : animateToPosition,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.parallel([
        Animated.timing(sizeAnim, {
          toValue: customStyles.currentStepIndicatorSize,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(borderRadiusAnim, {
          toValue: customStyles.currentStepIndicatorSize / 2,
          duration: 100,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };

  return (
    <View
      style={[
        styles.container,
        direction === 'vertical'
          ? { flexDirection: 'row', flex: 1 }
          : { flexDirection: 'column' },
      ]}
    >
      {width !== 0 && (
        <React.Fragment>
          {renderProgressBarBackground()}
          {renderProgressBar()}
        </React.Fragment>
      )}
      {renderStepIndicator()}
      {labels && renderStepLabels()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(1,0,0,0)',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(1,0,0,0)',
  },
  stepLabelsContainer: {
    justifyContent: 'space-around',
  },
  step: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    width: Constants.width * 0.2,
  },
  stepLabelItem: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(StepIndicator);






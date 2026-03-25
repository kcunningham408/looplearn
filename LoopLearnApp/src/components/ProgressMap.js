import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import COLORS from '../config/colors';
import { getGradeTheme } from '../config/gradeThemes';
import TYPE from '../config/typography';
import { useGameStore } from '../store/useGameStore';
import { BounceButton } from './BounceButton';

/**
 * Adventure trail map — each loop is a node on a winding path.
 * Completed nodes glow green, current node pulses, locked are dimmed.
 * Replaces the old flat FlatList of LoopCards.
 */
export const ProgressMap = ({ loops, subject, getProgress }) => {
  const navigation = useNavigation();
  const grade = useGameStore(s => s.grade);
  const theme = getGradeTheme(grade);

  const accent = subject === 'math' ? COLORS.math : COLORS.science;

  return (
    <ScrollView
      style={st.container}
      contentContainerStyle={st.content}
      showsVerticalScrollIndicator={false}
    >
      {loops.map((loop, index) => {
        const progress = getProgress(loop);
        const isComplete = progress >= 100;
        const isFirst = index === 0;
        const prevComplete = index > 0 ? getProgress(loops[index - 1]) >= 100 : true;
        const isUnlocked = isFirst || prevComplete;

        // Zig-zag path: even indices left, odd indices right
        const isRight = index % 2 === 1;

        return (
          <View key={loop.loop} style={st.nodeRow}>
            {/* Connector line from previous node */}
            {index > 0 && (
              <View style={[
                st.connector,
                isRight ? st.connectorRight : st.connectorLeft,
                { backgroundColor: isUnlocked ? `${accent}40` : 'rgba(255,255,255,0.06)' },
              ]} />
            )}

            {/* Node */}
            <View style={[st.nodeWrapper, isRight ? st.nodeRight : st.nodeLeft]}>
              <BounceButton
                onPress={() => {
                  if (isUnlocked) {
                    navigation.navigate('LoopDetail', { subject, loop: loop.loop });
                  }
                }}
                disabled={!isUnlocked}
              >
                <View style={[
                  st.node,
                  {
                    borderColor: isComplete ? theme.completedNode
                      : isUnlocked ? accent
                      : 'rgba(255,255,255,0.12)',
                    backgroundColor: isComplete ? `${theme.completedNode}18`
                      : isUnlocked ? `${accent}12`
                      : 'rgba(255,255,255,0.04)',
                    borderRadius: theme.cardRadius,
                  },
                  isComplete && {
                    shadowColor: theme.completedNode,
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 8,
                  },
                ]}>
                  {/* Progress ring around node */}
                  {isUnlocked && (
                    <View style={[
                      st.progressBorder,
                      {
                        borderColor: accent,
                        borderWidth: 3,
                        borderRadius: theme.cardRadius,
                        opacity: progress > 0 && !isComplete ? 0.6 : 0,
                      },
                    ]} />
                  )}

                  {/* Node content */}
                  <View style={st.nodeContent}>
                    <View style={[
                      st.nodeIcon,
                      {
                        backgroundColor: isComplete ? `${theme.completedNode}25`
                          : isUnlocked ? `${accent}20` : 'rgba(255,255,255,0.06)',
                      },
                    ]}>
                      <Text style={st.nodeEmoji}>
                        {isComplete ? '✅' : !isUnlocked ? '🔒' : getLoopEmoji(index)}
                      </Text>
                    </View>

                    <View style={st.nodeText}>
                      <Text style={[
                        st.nodeTitle,
                        !isUnlocked && { color: COLORS.textMuted },
                      ]} numberOfLines={2}>
                        {loop.title}
                      </Text>
                      <Text style={[
                        st.nodeSub,
                        isComplete && { color: theme.completedNode },
                      ]}>
                        {isComplete ? '🎉 Complete!'
                          : `${loop.links?.length || 0} lessons · ${progress}%`}
                      </Text>
                    </View>

                    {isUnlocked && (
                      <View style={[st.nodeArrow, { backgroundColor: `${accent}20` }]}>
                        <Text style={{ fontSize: 14 }}>▶</Text>
                      </View>
                    )}
                  </View>
                </View>
              </BounceButton>
            </View>
          </View>
        );
      })}

      {/* Trail end decoration */}
      {loops.length > 0 && (
        <View style={st.trailEnd}>
          <Text style={st.trailEndEmoji}>🏆</Text>
          <Text style={st.trailEndText}>Complete all loops!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const LOOP_EMOJIS = ['🚀', '⭐', '🎯', '🧩', '🌈', '🎨', '💡', '🔮', '🎪', '🏆', '🎸', '🦄'];
const getLoopEmoji = (index) => LOOP_EMOJIS[index % LOOP_EMOJIS.length];

const st = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
  },
  nodeRow: {
    marginBottom: 8,
    position: 'relative',
  },
  nodeWrapper: {
    maxWidth: '85%',
  },
  nodeLeft: {
    alignSelf: 'flex-start',
  },
  nodeRight: {
    alignSelf: 'flex-end',
  },
  connector: {
    position: 'absolute',
    top: -12,
    width: 3,
    height: 20,
    borderRadius: 2,
  },
  connectorLeft: {
    left: 40,
  },
  connectorRight: {
    right: 40,
  },
  node: {
    borderWidth: 2,
    padding: 16,
    overflow: 'hidden',
  },
  progressBorder: {
    ...StyleSheet.absoluteFillObject,
  },
  nodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nodeEmoji: { fontSize: 22 },
  nodeText: { flex: 1 },
  nodeTitle: {
    ...TYPE.lg,
    ...TYPE.bold,
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  nodeSub: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
  },
  nodeArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  trailEnd: {
    alignItems: 'center',
    paddingTop: 20,
    opacity: 0.5,
  },
  trailEndEmoji: { fontSize: 36, marginBottom: 6 },
  trailEndText: {
    ...TYPE.sm,
    ...TYPE.semibold,
    color: COLORS.textMuted,
  },
});

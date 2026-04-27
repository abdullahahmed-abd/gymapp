// src/screens/user/MembersFriendScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  UserMultipleIcon,
  Search01Icon,
  QrCodeIcon,
  UserAdd01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  Edit02Icon,
  Delete02Icon,
  UserCheck01Icon,
  UserRemove01Icon,
  Loading03Icon,
  Notification03Icon,
  Fire02Icon,
  Activity01Icon,
  Calendar01Icon,
  Notification01Icon,
  SentIcon,
} from '@hugeicons/core-free-icons';
import { useRoute } from '@react-navigation/native';

import Header from '../../components/shared/Header';
import GlassCard from '../../components/shared/GlassCard';
import BottomNav from '../../components/shared/BottomNav';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const s = (size) => scale(size);
const ms = (size) => moderateScale(size, 0.25);
const vs = (size) => verticalScale(size);
const rf = (size) => RFValue(size);

const CYAN = '#06b6d4';
const ORANGE = '#f97316';

// ═══════════════════════════════════════════════════════════════
// DUMMY DATA
// ═══════════════════════════════════════════════════════════════
const CURRENT_USER = {
  id: 'user_001',
  name: 'Abdullah Ahmed',
  memberId: 'GYM-2024-001',
};

const ALL_MEMBERS = [
  { id: 'user_002', name: 'Hassan Ali', memberId: 'GYM-2024-002' },
  { id: 'user_003', name: 'Bilal Khan', memberId: 'GYM-2024-003' },
  { id: 'user_004', name: 'Ahmed Raza', memberId: 'GYM-2024-004' },
  { id: 'user_005', name: 'Usman Tariq', memberId: 'GYM-2024-005' },
  { id: 'user_006', name: 'Zain Malik', memberId: 'GYM-2024-006' },
  { id: 'user_007', name: 'Fahad Sheikh', memberId: 'GYM-2024-007' },
  { id: 'user_008', name: 'Saad Qureshi', memberId: 'GYM-2024-008' },
];

const INITIAL_FRIENDS = [
  {
    id: 'f1',
    friendId: 'user_003',
    name: 'Bilal Khan',
    memberId: 'GYM-2024-003',
    nickname: 'Billu Bhai',
    status: 'accepted',
    addedAt: '2024-12-15',
    togetherCheckins: 18,
    togetherCheckouts: 16,
    currentStreak: 5,
    bestStreak: 12,
    lastTogether: '2025-01-14',
    isCurrentlyInGym: true,
  },
  {
    id: 'f2',
    friendId: 'user_005',
    name: 'Usman Tariq',
    memberId: 'GYM-2024-005',
    nickname: '',
    status: 'accepted',
    addedAt: '2024-12-20',
    togetherCheckins: 7,
    togetherCheckouts: 7,
    currentStreak: 0,
    bestStreak: 4,
    lastTogether: '2025-01-10',
    isCurrentlyInGym: false,
  },
  {
    id: 'f3',
    friendId: 'user_002',
    name: 'Hassan Ali',
    memberId: 'GYM-2024-002',
    nickname: 'Hasan Bro',
    status: 'accepted',
    addedAt: '2025-01-02',
    togetherCheckins: 3,
    togetherCheckouts: 3,
    currentStreak: 3,
    bestStreak: 3,
    lastTogether: '2025-01-14',
    isCurrentlyInGym: true,
  },
];

const INITIAL_PENDING = [
  { id: 'r1', fromId: 'user_004', fromName: 'Ahmed Raza', fromMemberId: 'GYM-2024-004', sentAt: '2025-01-10T09:30:00' },
  { id: 'r2', fromId: 'user_006', fromName: 'Zain Malik', fromMemberId: 'GYM-2024-006', sentAt: '2025-01-12T14:15:00' },
  { id: 'r3', fromId: 'user_008', fromName: 'Saad Qureshi', fromMemberId: 'GYM-2024-008', sentAt: '2025-01-13T18:45:00' },
];

const INITIAL_SENT = [
  { id: 'sr1', toId: 'user_007', toName: 'Fahad Sheikh', toMemberId: 'GYM-2024-007', sentAt: '2025-01-11T11:20:00' },
];

const NUDGE_MESSAGES = [
  "🏋️ Let's hit the gym together today!",
  '💪 Workout time! Are you coming?',
  "🔥 Don't break our streak! Come to gym!",
  "⚡ I'm heading to the gym, join me!",
  "🎯 Let's crush today's session together!",
];

// ═══════════════════════════════════════════════════════════════
// AVATAR
// ═══════════════════════════════════════════════════════════════
const Avatar = ({ name, size = 40, color = Colors.gold, isOnline = false }) => {
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <View style={{ position: 'relative' }}>
      <View
        style={[
          styles.avatar,
          {
            width: ms(size),
            height: ms(size),
            borderRadius: ms(size / 2),
            borderColor: `${color}40`,
          },
        ]}
      >
        <Text style={[styles.avatarText, { color, fontSize: rf(size / 4) }]}>
          {initials}
        </Text>
      </View>
      {isOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              width: ms(size / 4),
              height: ms(size / 4),
              borderRadius: ms(size / 8),
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// STREAK BADGE
// ═══════════════════════════════════════════════════════════════
const StreakBadge = ({ streak }) => {
  if (streak <= 0) return null;
  const color = streak >= 10 ? '#ef4444' : streak >= 5 ? Colors.gold : '#22c55e';

  return (
    <View
      style={[
        styles.streakBadge,
        { backgroundColor: `${color}15`, borderColor: `${color}30` },
      ]}
    >
      <HugeiconsIcon icon={Fire02Icon} size={ms(10)} color={color} />
      <Text style={[styles.streakText, { color }]}>{streak}</Text>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
// FRIEND CARD (Updated - Gym Together section removed, full card clickable)
// ═══════════════════════════════════════════════════════════════
const FriendCard = ({
  friend,
  onEditNickname,
  onRemove,
  onNudge,
  onViewStats,
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => onViewStats(friend)}
  >
    <View style={styles.friendCard}>
      <View style={styles.friendTopRow}>
        <View style={styles.friendCardLeft}>
          <Avatar
            name={friend.nickname || friend.name}
            size={44}
            color={friend.isCurrentlyInGym ? '#22c55e' : Colors.gold}
            isOnline={friend.isCurrentlyInGym}
          />
          <View style={styles.friendInfo}>
            <View style={styles.friendNameRow}>
              <Text style={styles.friendDisplayName} numberOfLines={1}>
                {friend.nickname || friend.name}
              </Text>
              <StreakBadge streak={friend.currentStreak} />
            </View>
            {friend.nickname ? (
              <Text style={styles.friendRealName}>{friend.name}</Text>
            ) : null}
            <View style={styles.friendMetaRow}>
              <View style={styles.friendIdBadge}>
                <Text style={styles.friendIdText}>{friend.memberId}</Text>
              </View>
              {friend.isCurrentlyInGym && (
                <View style={styles.inGymBadge}>
                  <View style={styles.inGymDot} />
                  <Text style={styles.inGymText}>In Gym</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.friendActions}>
          <TouchableOpacity
            style={[styles.friendActionBtn, styles.nudgeBtn]}
            onPress={(e) => {
              e.stopPropagation();
              onNudge(friend);
            }}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Notification03Icon} size={ms(14)} color={Colors.gold} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.friendActionBtn}
            onPress={(e) => {
              e.stopPropagation();
              onEditNickname(friend);
            }}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Edit02Icon} size={ms(14)} color={Colors.zinc[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.friendActionBtn, styles.removeBtn]}
            onPress={(e) => {
              e.stopPropagation();
              onRemove(friend);
            }}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Delete02Icon} size={ms(14)} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tap Hint */}
      <View style={styles.tapHintRow}>
        <HugeiconsIcon icon={Activity01Icon} size={ms(9)} color={Colors.zinc[600]} />
        <Text style={styles.tapHintText}>Tap to view gym together stats</Text>
        <HugeiconsIcon icon={ArrowRight01Icon} size={ms(9)} color={Colors.zinc[600]} />
      </View>
    </View>
  </TouchableOpacity>
);

// ═══════════════════════════════════════════════════════════════
// SEARCH MODAL, NUDGE MODAL, NICKNAME MODAL, STATS MODAL (Unchanged)
// ═══════════════════════════════════════════════════════════════
const SearchModal = ({
  visible,
  onClose,
  searchQuery,
  setSearchQuery,
  searchResults,
  onSendRequest,
  friends,
  pendingRequests,
  sentRequests,
  onScan,
}) => (
  <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable style={styles.modalContent} onPress={() => {}}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'}
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(12,12,16,0.98)"
        />
        <View style={styles.modalHeader}>
          <View style={styles.modalDragHandle} />
          <Text style={styles.modalTitle}>FIND MEMBERS</Text>
          <Text style={styles.modalSubtitle}>Search by Member ID or name</Text>
        </View>

        <View style={styles.searchBarContainer}>
          <View style={styles.searchInputWrapper}>
            <HugeiconsIcon icon={Search01Icon} size={ms(16)} color={Colors.zinc[500]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter Member ID or Name..."
              placeholderTextColor={Colors.zinc[600]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <HugeiconsIcon icon={Cancel01Icon} size={ms(14)} color={Colors.zinc[500]} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.scanBtn} onPress={onScan} activeOpacity={0.7}>
            <HugeiconsIcon icon={QrCodeIcon} size={ms(20)} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.searchResultsContent}
          bounces={false}
        >
          {/* ... (SearchModal content remains same as before) ... */}
          {searchQuery.length === 0 ? (
            <View style={styles.emptySearchState}>
              <HugeiconsIcon icon={Search01Icon} size={ms(40)} color={Colors.zinc[700]} />
              <Text style={styles.emptySearchTitle}>Search Members</Text>
              <Text style={styles.emptySearchSubtitle}>
                Type a Member ID (e.g. GYM-2024-002) or name
              </Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.emptySearchState}>
              <HugeiconsIcon icon={UserRemove01Icon} size={ms(40)} color={Colors.zinc[700]} />
              <Text style={styles.emptySearchTitle}>No Members Found</Text>
              <Text style={styles.emptySearchSubtitle}>
                Try a different Member ID or name
              </Text>
            </View>
          ) : (
            searchResults.map((member) => {
              const isFriend = friends.some((f) => f.friendId === member.id);
              const isPending = pendingRequests.some((r) => r.fromId === member.id);
              const isSent = sentRequests.some((r) => r.toId === member.id);

              const getStatus = () => {
                if (isFriend) return { text: 'Friends', color: '#22c55e', icon: UserCheck01Icon };
                if (isPending) return { text: 'Pending', color: CYAN, icon: Clock01Icon };
                if (isSent) return { text: 'Sent', color: ORANGE, icon: Loading03Icon };
                return null;
              };

              const status = getStatus();

              return (
                <View key={member.id} style={styles.searchResultCard}>
                  <View style={styles.friendCardLeft}>
                    <Avatar name={member.name} size={42} color={Colors.zinc[400]} />
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendDisplayName}>{member.name}</Text>
                      <View style={styles.friendIdBadge}>
                        <Text style={styles.friendIdText}>{member.memberId}</Text>
                      </View>
                    </View>
                  </View>

                  {status ? (
                    <View style={[styles.statusBadge, { backgroundColor: `${status.color}15`, borderColor: `${status.color}30` }]}>
                      <HugeiconsIcon icon={status.icon} size={ms(10)} color={status.color} />
                      <Text style={[styles.statusBadgeText, { color: status.color }]}>{status.text}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.sendRequestBtn} onPress={() => onSendRequest(member)} activeOpacity={0.7}>
                      <HugeiconsIcon icon={UserAdd01Icon} size={ms(14)} color={Colors.white} />
                      <Text style={styles.sendRequestText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>

        <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
          <Text style={styles.closeModalText}>CLOSE</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);

// NudgeModal, NicknameModal, FriendStatsModal remain unchanged (same as your previous version)
const NudgeModal = ({ visible, onClose, friend, onSendNudge, customMessage, setCustomMessage }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.centerOverlay} onPress={onClose}>
      <Pressable style={styles.nudgeModalContent} onPress={() => {}}>
        <BlurView style={StyleSheet.absoluteFill} blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'} blurAmount={25} reducedTransparencyFallbackColor="rgba(12,12,16,0.98)" />
        <View style={styles.nudgeHeader}>
          <HugeiconsIcon icon={Notification03Icon} size={ms(24)} color={Colors.gold} />
          <Text style={styles.nudgeTitle}>Send Nudge</Text>
          <Text style={styles.nudgeSubtitle}>Notify {friend?.nickname || friend?.name} to hit the gym!</Text>
        </View>
        <Text style={styles.quickLabel}>QUICK MESSAGES</Text>
        <ScrollView style={styles.nudgeScroll} showsVerticalScrollIndicator={false} bounces={false}>
          {NUDGE_MESSAGES.map((msg, idx) => (
            <TouchableOpacity key={idx} style={styles.nudgeItem} onPress={() => onSendNudge(friend, msg)} activeOpacity={0.7}>
              <Text style={styles.nudgeItemText}>{msg}</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={ms(12)} color={Colors.zinc[500]} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.quickLabel}>CUSTOM MESSAGE</Text>
        <View style={styles.customInputRow}>
          <TextInput
            style={styles.customInput}
            placeholder="Type your message..."
            placeholderTextColor={Colors.zinc[600]}
            value={customMessage}
            onChangeText={setCustomMessage}
            maxLength={100}
          />
          <TouchableOpacity
            style={[styles.customSendBtn, !customMessage.trim() && styles.customSendBtnDisabled]}
            onPress={() => { if (customMessage.trim()) onSendNudge(friend, customMessage.trim()); }}
            activeOpacity={0.7}
            disabled={!customMessage.trim()}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={ms(16)} color={customMessage.trim() ? Colors.white : Colors.zinc[600]} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.nudgeCloseBtn} onPress={onClose}>
          <Text style={styles.closeModalText}>CLOSE</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);

const NicknameModal = ({ visible, onClose, friend, nickname, setNickname, onSave }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.centerOverlay} onPress={onClose}>
      <Pressable style={styles.nicknameContent} onPress={() => {}}>
        <BlurView style={StyleSheet.absoluteFill} blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'} blurAmount={25} reducedTransparencyFallbackColor="rgba(12,12,16,0.98)" />
        <View style={styles.nicknameHeader}>
          <HugeiconsIcon icon={Edit02Icon} size={ms(20)} color={Colors.gold} />
          <Text style={styles.nicknameTitle}>Set Nickname</Text>
          <Text style={styles.nudgeSubtitle}>Give a custom name for {friend?.name}</Text>
        </View>
        <View style={styles.nicknameInputContainer}>
          <Text style={styles.quickLabel}>DISPLAY NAME</Text>
          <TextInput
            style={styles.nicknameInput}
            placeholder={friend?.name || 'Enter nickname...'}
            placeholderTextColor={Colors.zinc[600]}
            value={nickname}
            onChangeText={setNickname}
            autoFocus
            maxLength={30}
          />
          <Text style={styles.nicknameHint}>Leave empty to show original name</Text>
        </View>
        <View style={styles.nicknameActions}>
          <TouchableOpacity style={styles.nicknameCancelBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.nicknameCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nicknameSaveBtn} onPress={onSave} activeOpacity={0.7}>
            <Text style={styles.nicknameSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

const FriendStatsModal = ({ visible, onClose, friend }) => {
  if (!friend) return null;
  const avgPerWeek = friend.togetherCheckins > 0 ? (friend.togetherCheckins / 4).toFixed(1) : '0';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.statsModalContent} onPress={() => {}}>
          <BlurView style={StyleSheet.absoluteFill} blurType={Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'} blurAmount={20} reducedTransparencyFallbackColor="rgba(12,12,16,0.98)" />
          <View style={styles.modalHeader}>
            <View style={styles.modalDragHandle} />
            <Text style={styles.modalTitle}>GYM TOGETHER</Text>
            <Text style={styles.modalSubtitle}>You & {friend.nickname || friend.name}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.statsScrollContent} bounces={false}>
            {/* Stats Modal content remains same as before */}
            {/* (Keeping it unchanged as per your request) */}
            <View style={styles.statsProfileRow}>
              <Avatar name={friend.nickname || friend.name} size={56} color={Colors.gold} isOnline={friend.isCurrentlyInGym} />
              <View style={styles.statsProfileInfo}>
                <Text style={styles.statsProfileName}>{friend.nickname || friend.name}</Text>
                {friend.nickname ? <Text style={styles.statsProfileReal}>{friend.name}</Text> : null}
                <Text style={styles.statsProfileId}>{friend.memberId}</Text>
              </View>
              <StreakBadge streak={friend.currentStreak} />
            </View>

            <View style={styles.statsGrid}>
              {[
                { icon: CheckmarkCircle02Icon, color: '#22c55e', value: friend.togetherCheckins, label: 'Together\nCheck-ins' },
                { icon: Activity01Icon, color: '#a855f7', value: friend.togetherCheckouts, label: 'Together\nCheck-outs' },
                { icon: Fire02Icon, color: Colors.gold, value: friend.currentStreak, label: 'Current\nStreak' },
                { icon: Fire02Icon, color: Colors.blue, value: friend.bestStreak, label: 'Best\nStreak' },
              ].map((item, idx) => (
                <View key={idx} style={[styles.statsGridItem, { borderColor: `${item.color}20` }]}>
                  <HugeiconsIcon icon={item.icon} size={ms(18)} color={item.color} />
                  <Text style={[styles.statsGridNumber, { color: item.color }]}>{item.value}</Text>
                  <Text style={styles.statsGridLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.statsExtraBox}>
              {[
                { label: 'Avg. per week', value: `${avgPerWeek} sessions` },
                { label: 'Friends since', value: new Date(friend.addedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { label: 'Last together', value: friend.lastTogether ? new Date(friend.lastTogether).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never' },
              ].map((item, idx) => (
                <React.Fragment key={idx}>
                  <View style={styles.statsExtraRow}>
                    <Text style={styles.statsExtraLabel}>{item.label}</Text>
                    <Text style={styles.statsExtraValue}>{item.value}</Text>
                  </View>
                  {idx < 2 && <View style={styles.statsExtraDivider} />}
                </React.Fragment>
              ))}
              <View style={styles.statsExtraDivider} />
              <View style={styles.statsExtraRow}>
                <Text style={styles.statsExtraLabel}>Status</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDotSmall, { backgroundColor: friend.isCurrentlyInGym ? '#22c55e' : Colors.zinc[600] }]} />
                  <Text style={[styles.statsExtraValue, { color: friend.isCurrentlyInGym ? '#22c55e' : Colors.zinc[500] }]}>
                    {friend.isCurrentlyInGym ? 'In Gym Now' : 'Not in Gym'}
                  </Text>
                </View>
              </View>
            </View>

            {friend.currentStreak > 0 && (
              <LinearGradient colors={['rgba(234,179,8,0.12)', 'rgba(234,179,8,0.04)', 'transparent']} style={styles.streakMotivation}>
                <HugeiconsIcon icon={Fire02Icon} size={ms(20)} color={Colors.gold} />
                <View style={{ flex: 1, gap: vs(2) }}>
                  <Text style={styles.streakMotivTitle}>{friend.currentStreak} Day Streak! 🔥</Text>
                  <Text style={styles.streakMotivSub}>
                    {friend.currentStreak >= friend.bestStreak ? "You're at your best streak!" : `${friend.bestStreak - friend.currentStreak} more days to beat your best!`}
                  </Text>
                </View>
              </LinearGradient>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalText}>CLOSE</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const SectionHeader = ({ icon, title, count, color = Colors.white }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderLeft}>
      <HugeiconsIcon icon={icon} size={ms(14)} color={color} />
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    </View>
    {count > 0 && (
      <View style={[styles.countBadge, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
        <Text style={[styles.countText, { color }]}>{count}</Text>
      </View>
    )}
  </View>
);

// ═══════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════
const MembersFriendScreen = ({ navigation }) => {
  const route = useRoute();

  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [pendingRequests] = useState(INITIAL_PENDING);
  const [sentRequests, setSentRequests] = useState(INITIAL_SENT);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [nickname, setNickname] = useState('');
  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [nudgeFriend, setNudgeFriend] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsFriend, setStatsFriend] = useState(null);

  useEffect(() => {
    if (route.params?.openSearch) {
      setShowSearchModal(true);
      navigation.setParams({ openSearch: false });
    }
  }, [route.params?.openSearch, navigation]);

  const searchResults = searchQuery.length > 0
    ? ALL_MEMBERS.filter(
        (m) => m.id !== CURRENT_USER.id &&
          (m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSendRequest = (member) => {
    Alert.alert('Send Friend Request', `Send request to ${member.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Send',
        onPress: () => {
          setSentRequests((prev) => [...prev, {
            id: `sr_${Date.now()}`, toId: member.id, toName: member.name,
            toMemberId: member.memberId, sentAt: new Date().toISOString(),
          }]);
          Alert.alert('Request Sent! 🎉', `Friend request sent to ${member.name}`);
        },
      },
    ]);
  };

  const handleEditNickname = (friend) => {
    setSelectedFriend(friend);
    setNickname(friend.nickname || '');
    setShowNicknameModal(true);
  };

  const handleSaveNickname = () => {
    if (selectedFriend) {
      setFriends((prev) =>
        prev.map((f) =>
          f.id === selectedFriend.id ? { ...f, nickname: nickname.trim() } : f
        )
      );
      setShowNicknameModal(false);
      setSelectedFriend(null);
      setNickname('');
    }
  };

  const handleRemoveFriend = (friend) => {
    Alert.alert('Remove Friend', `Remove ${friend.nickname || friend.name}?\n\nAll together stats will be lost.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setFriends((prev) => prev.filter((f) => f.id !== friend.id)) },
    ]);
  };

  const handleOpenNudge = (friend) => {
    setNudgeFriend(friend);
    setCustomMessage('');
    setShowNudgeModal(true);
  };

  const handleSendNudge = (friend, message) => {
    setShowNudgeModal(false);
    setCustomMessage('');
    Alert.alert('Nudge Sent! 💪', `"${message}" sent to ${friend.nickname || friend.name}`);
  };

  const handleViewStats = (friend) => {
    setStatsFriend(friend);
    setShowStatsModal(true);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' }}
      style={styles.background}
      blurRadius={10}
    >
      <LinearGradient colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.92)', '#000000']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Header />

          <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.pageHeader}>
              <View>
                <Text style={styles.pageLabel}>MY NETWORK</Text>
                <Text style={styles.pageTitle}>Friends</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={() => setShowSearchModal(true)} activeOpacity={0.7}>
                <HugeiconsIcon icon={UserAdd01Icon} size={ms(16)} color={Colors.white} />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            <GlassCard>
              <View style={styles.statsContainer}>
                {[
                  { value: friends.length, label: 'Friends', color: Colors.white },
                  { value: pendingRequests.length, label: 'Received', color: Colors.burlywood4 },
                  { value: sentRequests.length, label: 'Sent', color: '#8B8878' },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <View style={styles.statDivider} />}
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: item.color }]}>{item.value}</Text>
                      <Text style={styles.statLabel}>{item.label}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </GlassCard>

            <TouchableOpacity style={styles.quickSearchBar} onPress={() => setShowSearchModal(true)} activeOpacity={0.7}>
              <HugeiconsIcon icon={Search01Icon} size={ms(14)} color={Colors.zinc[600]} />
              <Text style={styles.quickSearchText}>Search by Member ID or name...</Text>
              <HugeiconsIcon icon={QrCodeIcon} size={ms(14)} color={Colors.zinc[400]} />
            </TouchableOpacity>

            <View style={styles.navCardsRow}>
              <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate('ReceivedRequests')} activeOpacity={0.7}>
                <View style={styles.navCardRow}>
                  <View style={styles.navCardIconWrap}>
                    <HugeiconsIcon icon={Notification01Icon} size={ms(16)} color={Colors.white} />
                  </View>
                  <View style={styles.navCardTextWrap}>
                    <Text style={styles.navCardTitle}>Received</Text>
                    <Text style={styles.navCardSubtitle}>Friend requests</Text>
                  </View>
                </View>
                {pendingRequests.length > 0 && (
                  <View style={styles.navCardBadge}>
                    <Text style={styles.navCardBadgeText}>{pendingRequests.length}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate('SentRequests')} activeOpacity={0.7}>
                <View style={styles.navCardRow}>
                  <View style={styles.navCardIconWrap}>
                    <HugeiconsIcon icon={SentIcon} size={ms(16)} color={Colors.white} />
                  </View>
                  <View style={styles.navCardTextWrap}>
                    <Text style={styles.navCardTitle}>Sent</Text>
                    <Text style={styles.navCardSubtitle}>Your requests</Text>
                  </View>
                </View>
                {sentRequests.length > 0 && (
                  <View style={styles.navCardBadge}>
                    <Text style={styles.navCardBadgeText}>{sentRequests.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <SectionHeader icon={UserMultipleIcon} title="My Friends" count={friends.length} />
              {friends.length === 0 ? (
                <View style={styles.emptyFriends}>
                  <HugeiconsIcon icon={UserMultipleIcon} size={ms(40)} color={Colors.zinc[700]} />
                  <Text style={styles.emptyTitle}>No Friends Yet</Text>
                  <Text style={styles.emptySubtitle}>Search and add gym members as friends</Text>
                  <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setShowSearchModal(true)} activeOpacity={0.7}>
                    <HugeiconsIcon icon={UserAdd01Icon} size={ms(14)} color={Colors.gold} />
                    <Text style={styles.emptyAddText}>Find Members</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                friends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onEditNickname={handleEditNickname}
                    onRemove={handleRemoveFriend}
                    onNudge={handleOpenNudge}
                    onViewStats={handleViewStats}
                  />
                ))
              )}
            </View>
          </ScrollView>

          <BottomNav
            activeTab="friends"
            onTabChange={(tab) => {
              if (tab === 'home') navigation.navigate('UserDashboard');
              if (tab === 'profile') navigation.navigate('UserProfile');
              if (tab === 'membership') navigation.navigate('UserDashboard', { openPlans: true });
              if (tab === 'friends') {}
            }}
          />

          <SearchModal
            visible={showSearchModal}
            onClose={() => { setShowSearchModal(false); setSearchQuery(''); }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            onSendRequest={handleSendRequest}
            friends={friends}
            pendingRequests={pendingRequests}
            sentRequests={sentRequests}
            onScan={() => Alert.alert('QR Scanner', 'Coming soon!')}
          />

          <NicknameModal
            visible={showNicknameModal}
            onClose={() => { setShowNicknameModal(false); setSelectedFriend(null); }}
            friend={selectedFriend}
            nickname={nickname}
            setNickname={setNickname}
            onSave={handleSaveNickname}
          />

          <NudgeModal
            visible={showNudgeModal}
            onClose={() => { setShowNudgeModal(false); setNudgeFriend(null); }}
            friend={nudgeFriend}
            onSendNudge={handleSendNudge}
            customMessage={customMessage}
            setCustomMessage={setCustomMessage}
          />

          <FriendStatsModal
            visible={showStatsModal}
            onClose={() => { setShowStatsModal(false); setStatsFriend(null); }}
            friend={statsFriend}
          />
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

// ═══════════════════════════════════════════════════════════════
// STYLES (Cleaned - removed togetherSection styles, added tapHint styles)
// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  background: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: s(24), gap: vs(12), paddingBottom: vs(100) },

  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[400], letterSpacing: s(2), textTransform: 'uppercase', marginBottom: vs(2), fontWeight: '600' },
  pageTitle: { fontFamily: Fonts.orbitron.extraBold, fontSize: rf(20), color: Colors.white, letterSpacing: s(3) },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: s(6), backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: s(14), paddingVertical: vs(8), borderRadius: ms(8), borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  addBtnText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.white, letterSpacing: s(1) },

  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: vs(4) },
  statItem: { alignItems: 'center', gap: vs(4) },
  statNumber: { fontFamily: Fonts.orbitron.bold, fontSize: rf(18), color: Colors.white },
  statLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(6), color: Colors.zinc[500], letterSpacing: s(1.5), textTransform: 'uppercase' },
  statDivider: { width: 1, height: vs(30), backgroundColor: 'rgba(255,255,255,0.08)' },

  quickSearchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: s(14), paddingVertical: vs(12), gap: s(10) },
  quickSearchText: { flex: 1, fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[600] },

  navCardsRow: { flexDirection: 'row', gap: s(10) },
  navCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: s(12),
    paddingVertical: vs(14),
  },
  navCardRow: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  navCardIconWrap: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(9),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCardTextWrap: { gap: vs(1) },
  navCardTitle: { fontFamily: Fonts.orbitron.semiBold, fontSize: rf(9), color: Colors.white, letterSpacing: s(0.5) },
  navCardSubtitle: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(6), color: Colors.zinc[500], letterSpacing: s(0.5) },
  navCardBadge: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    minWidth: ms(15),
    height: ms(15),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(5),
    marginBottom: s(13),
  },
  navCardBadgeText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(7), color: '#000000' },

  section: { gap: vs(8) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4) },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  sectionTitle: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(8), color: Colors.white, letterSpacing: s(2), textTransform: 'uppercase' },
  countBadge: { paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(4), borderWidth: 1 },
  countText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(8) },

  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  avatarText: { fontFamily: Fonts.orbitron.bold },
  onlineDot: { position: 'absolute', backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#0a0a0a' },

  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: s(3), paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(6), borderWidth: 1 },
  streakText: { fontFamily: Fonts.orbitron.bold, fontSize: rf(8) },

  friendCard: {
    backgroundColor: 'black',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: s(12),
  },
  friendTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  friendCardLeft: { flexDirection: 'row', alignItems: 'center', gap: s(12), flex: 1 },
  friendInfo: { flex: 1, gap: vs(1) },
  friendNameRow: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  friendDisplayName: { fontFamily: Fonts.orbitron.semiBold, fontSize: rf(9), color: Colors.white, letterSpacing: s(0.5), flexShrink: 1 },
  friendRealName: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[500] },
  friendMetaRow: { flexDirection: 'row', alignItems: 'center', gap: s(8), marginTop: vs(2) },
  friendIdBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: s(6), paddingVertical: vs(1), borderRadius: ms(3) },
  friendIdText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(7), color: Colors.zinc[500], letterSpacing: s(0.5) },
  inGymBadge: { flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: 'rgba(34,197,94,0.10)', paddingHorizontal: s(6), paddingVertical: vs(1), borderRadius: ms(3) },
  inGymDot: { width: s(5), height: s(5), borderRadius: s(3), backgroundColor: '#22c55e' },
  inGymText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(6), color: '#22c55e', letterSpacing: s(0.5) },

  friendActions: { flexDirection: 'row', gap: s(5) },
  friendActionBtn: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(8),
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nudgeBtn: { backgroundColor: 'rgba(234,179,8,0.10)', borderColor: 'rgba(234,179,8,0.20)' },
  removeBtn: { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.15)' },

  // New Tap Hint
  tapHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    marginTop: vs(10),
    paddingTop: vs(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  tapHintText: {
    flex: 1,
    fontFamily: Fonts.rajdhani.regular,
    fontSize: rf(7),
    color: Colors.zinc[600],
    letterSpacing: s(0.3),
  },

  // Empty State
  emptyFriends: { alignItems: 'center', justifyContent: 'center', paddingVertical: vs(40), gap: vs(8) },
  emptyTitle: { fontFamily: Fonts.orbitron.semiBold, fontSize: rf(12), color: Colors.zinc[400], marginTop: vs(8) },
  emptySubtitle: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[600], textAlign: 'center' },
  emptyAddBtn: { flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: 'rgba(234,179,8,0.12)', paddingHorizontal: s(16), paddingVertical: vs(10), borderRadius: ms(8), borderWidth: 1, borderColor: 'rgba(234,179,8,0.25)', marginTop: vs(8) },
  emptyAddText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.gold, letterSpacing: s(1) },

  // Modals (unchanged - same as before)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  centerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: s(24) },
  modalContent: { maxHeight: '90%', borderTopLeftRadius: ms(24), borderTopRightRadius: ms(24), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#000' },
  statsModalContent: { maxHeight: '85%', borderTopLeftRadius: ms(24), borderTopRightRadius: ms(24), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#000' },
  modalHeader: { alignItems: 'center', paddingTop: vs(12), paddingBottom: vs(16), paddingHorizontal: s(20) },
  modalDragHandle: { width: s(40), height: vs(4), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: ms(2), marginBottom: vs(16) },
  modalTitle: { fontFamily: Fonts.orbitron.bold, fontSize: rf(14), color: Colors.white, letterSpacing: s(3), marginBottom: vs(4) },
  modalSubtitle: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500], letterSpacing: s(1) },
  closeModalButton: { alignItems: 'center', paddingVertical: vs(16), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },
  closeModalText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(10), color: Colors.zinc[500], letterSpacing: s(2) },

  searchBarContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(20), gap: s(10), marginBottom: vs(12) },
  searchInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: s(12), gap: s(8) },
  searchInput: { flex: 1, fontFamily: Fonts.rajdhani.regular, fontSize: rf(10), color: Colors.white, paddingVertical: vs(12) },
  scanBtn: { width: ms(46), height: ms(46), borderRadius: ms(10), backgroundColor: 'rgba(234,179,8,0.15)', borderWidth: 1, borderColor: 'rgba(234,179,8,0.30)', alignItems: 'center', justifyContent: 'center' },
  searchResultsContent: { paddingHorizontal: s(20), paddingBottom: vs(20), gap: vs(8) },
  emptySearchState: { alignItems: 'center', justifyContent: 'center', paddingVertical: vs(50), gap: vs(8) },
  emptySearchTitle: { fontFamily: Fonts.orbitron.semiBold, fontSize: rf(12), color: Colors.zinc[400], marginTop: vs(8) },
  emptySearchSubtitle: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[600], textAlign: 'center', paddingHorizontal: s(30) },

  searchResultCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'black', borderRadius: ms(12), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: s(12) },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(6), borderWidth: 1 },
  statusBadgeText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), letterSpacing: s(0.5) },
  sendRequestBtn: { flexDirection: 'row', alignItems: 'center', gap: s(6), backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: s(12), paddingVertical: vs(8), borderRadius: ms(8), borderWidth: 1, borderColor: 'rgba(234,179,8,0.30)' },
  sendRequestText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.white, letterSpacing: s(1) },

  nudgeModalContent: { width: '100%', borderRadius: ms(16), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0a0a0a', padding: s(20), maxHeight: '80%' },
  nudgeHeader: { alignItems: 'center', gap: vs(6), marginBottom: vs(16) },
  nudgeTitle: { fontFamily: Fonts.orbitron.bold, fontSize: rf(12), color: Colors.white, letterSpacing: s(2) },
  nudgeSubtitle: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500], textAlign: 'center' },
  quickLabel: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(7), color: Colors.zinc[500], letterSpacing: s(2), textTransform: 'uppercase', marginBottom: vs(8) },
  nudgeScroll: { maxHeight: vs(180), marginBottom: vs(16) },
  nudgeItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: ms(8), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: s(12), marginBottom: vs(6) },
  nudgeItemText: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.white, flex: 1, marginRight: s(8) },
  customInputRow: { flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(16) },
  customInput: { flex: 1, fontFamily: Fonts.rajdhani.regular, fontSize: rf(10), color: Colors.white, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', paddingHorizontal: s(14), paddingVertical: vs(10) },
  customSendBtn: { width: ms(42), height: ms(42), borderRadius: ms(10), backgroundColor: 'rgba(234,179,8,0.20)', borderWidth: 1, borderColor: 'rgba(234,179,8,0.35)', alignItems: 'center', justifyContent: 'center' },
  customSendBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' },
  nudgeCloseBtn: { alignItems: 'center', paddingVertical: vs(12), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' },

  nicknameContent: { width: '100%', borderRadius: ms(16), overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0a0a0a', padding: s(20) },
  nicknameHeader: { alignItems: 'center', gap: vs(6), marginBottom: vs(20) },
  nicknameTitle: { fontFamily: Fonts.orbitron.bold, fontSize: rf(12), color: Colors.white, letterSpacing: s(2) },
  nicknameInputContainer: { gap: vs(6) },
  nicknameInput: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(11), color: Colors.white, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: ms(10), borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', paddingHorizontal: s(14), paddingVertical: vs(12) },
  nicknameHint: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(7), color: Colors.zinc[600] },
  nicknameActions: { flexDirection: 'row', gap: s(12), marginTop: vs(20) },
  nicknameCancelBtn: { flex: 1, alignItems: 'center', paddingVertical: vs(12), borderRadius: ms(8), borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', backgroundColor: 'rgba(255,255,255,0.04)' },
  nicknameCancelText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.zinc[400], letterSpacing: s(1.5) },
  nicknameSaveBtn: { flex: 1, alignItems: 'center', paddingVertical: vs(12), borderRadius: ms(8), backgroundColor: 'rgba(234,179,8,0.15)', borderWidth: 1, borderColor: 'rgba(234,179,8,0.30)' },
  nicknameSaveText: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.gold, letterSpacing: s(1.5) },

  statsScrollContent: { paddingHorizontal: s(20), paddingBottom: vs(20), gap: vs(16) },
  statsProfileRow: { flexDirection: 'row', alignItems: 'center', gap: s(14) },
  statsProfileInfo: { flex: 1, gap: vs(2) },
  statsProfileName: { fontFamily: Fonts.orbitron.bold, fontSize: rf(12), color: Colors.white, letterSpacing: s(1) },
  statsProfileReal: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500] },
  statsProfileId: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[600], marginTop: vs(2) },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: s(10) },
  statsGridItem: { flex: 1, minWidth: '45%', alignItems: 'center', gap: vs(6), backgroundColor: 'black', borderRadius: ms(12), borderWidth: 1, padding: s(14) },
  statsGridNumber: { fontFamily: Fonts.orbitron.bold, fontSize: rf(18), color: Colors.white },
  statsGridLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(7), color: Colors.zinc[500], textAlign: 'center', letterSpacing: s(0.5) },
  statsExtraBox: { backgroundColor: 'black', borderRadius: ms(12), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: s(14) },
  statsExtraRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(6) },
  statsExtraLabel: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(9), color: Colors.zinc[500] },
  statsExtraValue: { fontFamily: Fonts.rajdhani.semiBold, fontSize: rf(9), color: Colors.white },
  statsExtraDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: s(5) },
  statusDotSmall: { width: s(6), height: s(6), borderRadius: s(3) },
  streakMotivation: { flexDirection: 'row', alignItems: 'center', gap: s(12), padding: s(14), borderRadius: ms(12), borderWidth: 1, borderColor: 'rgba(234,179,8,0.18)' },
  streakMotivTitle: { fontFamily: Fonts.orbitron.semiBold, fontSize: rf(10), color: Colors.gold, letterSpacing: s(1) },
  streakMotivSub: { fontFamily: Fonts.rajdhani.regular, fontSize: rf(8), color: Colors.zinc[400] },
});

export default MembersFriendScreen;
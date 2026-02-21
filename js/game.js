/**
 * The Rotting Tides of Time — game state and scene data
 * Choice labels are written so they do not give away outcomes.
 */

(function () {
  'use strict';

  var PARTY_IDS = ['grimshaw', 'suki', 'kaelen', 'malagant', 'snap', 'skewer'];
  var PROGRESS_HUBS = ['Fork', 'Ravine or Camp', 'The Hollow', 'Aftermath', 'Epilogue'];

  var state = {
    sceneId: 'fork',
    path: null,           // 'rite' | 'echo'
    kaelenMemory: null,   // 'flirty' | 'friendly' (courtyard vs stacks)
    party: ['grimshaw', 'suki', 'kaelen', 'malagant', 'snap', 'skewer'],
    progress: 0,          // 0–4 index into PROGRESS_HUBS
    history: [],          // for outcome code
    outcomeCode: null     // set at ending
  };

  function getParty() { return state.party.slice(); }
  function getProgress() { return state.progress; }
  function getPath() { return state.path; }
  function getSceneId() { return state.sceneId; }
  function getOutcomeCode() { return state.outcomeCode; }
  function getKaelenMemory() { return state.kaelenMemory; }

  function setParty(party) { state.party = party.slice(); }
  function setProgress(n) { state.progress = Math.max(0, Math.min(4, n)); }
  function setPath(p) { state.path = p; }
  function setSceneId(id) { state.sceneId = id; }
  function setKaelenMemory(m) { state.kaelenMemory = m; }
  function pushHistory(step) { state.history.push(step); }

  function computeOutcomeCode() {
    var h = state.history;
    var path = state.path;
    var conv = '';  // RS | RF | ES | EM
    var choice = ''; // BR | RH | RB | SS | GB | KS
    var end = '';   // G | GAF | GNS | GS | GNM | D
    var i, step;

    for (i = 0; i < h.length; i++) {
      step = h[i];
      if (step.convergenceEntry) conv = step.convergenceEntry;
      if (step.convergenceChoice) choice = step.convergenceChoice;
      if (step.ending) end = step.ending;
    }

    if (path === 'rite') {
      if (!conv) conv = state.party.indexOf('skewer') === -1 ? 'RF' : 'RS';
    } else if (path === 'echo') {
      if (!conv) conv = state.party.indexOf('malagant') === -1 ? 'EM' : 'ES';
    }
    if (!conv && path) conv = path === 'rite' ? 'RS' : 'ES';

    state.outcomeCode = (conv || '??') + '-' + (choice || '??') + '-' + (end || '??');
    return state.outcomeCode;
  }

  var scenes = {
    fork: {
      title: 'The Fork in the Fallen Forest',
      body: 'You\'re picking up where the last session left off. The party just slew the pink slime monstrosity—the thing that had absorbed the life essence of your cousin Kaya. In that fight, the slime marked you. The pink slime curse burns cold on your arm. Suki shifts on your shoulder, uneasy. The group has split. You chose to follow the goblins and your old schoolmate to scout the Fallen Elder Tree. Here you are: Snap and Skewer, Kaelen, and Malagant. The forest is quiet... too quiet. First, you have to choose where to focus.',
      progress: 0,
      choices: [
        { emoji: '🐺', label: 'Survival: Aid Snap and Skewer—secure the wolf hides for the initiation. Track and support.', next: 'rite_ravine', setPath: 'rite' },
        { emoji: '🔍', label: 'Investigation: Aid Kaelen and Malagant—investigate the bards\' campsite (Gliss and Guile).', next: 'echo_path', setPath: 'echo' }
      ]
    },

    rite_ravine: {
      title: 'The Scavengers',
      body: 'Snap and Skewer lead the way. The trail drops into a ravine. The air is thick, wrong. Fungi punch out of the stone and rot in seconds. Time-Rot. The wolf corpses are here. Phase-Beetles flicker in and out of the material plane, eating the carcasses. Skewer\'s hand goes to a pistol. Snap hisses. "Don\'t. You can\'t shoot what\'s not there half the time." They look at you. Your move.',
      progress: 1,
      choices: [
        { emoji: '👁️', label: 'Familiar (Use Senses) + Eldritch Blast + Chill Touch: Stay at the rim; Suki spots, you call targets and preserve the hides in short forays.', next: 'rite_success' },
        { emoji: '🗣️', label: 'Direct Snap and Skewer to keep the beetles off the carcasses so you can Chill Touch the hides.', next: 'rite_skewer_falls' },
        { emoji: '🦶', label: 'Chill Touch: Go in yourself; trust Suki to warn you while you grab the hides.', next: 'rite_cycle' }
      ]
    },
    rite_success: {
      title: 'The Hides Are Won',
      body: 'You stayed at the rim. Suki spotted; you called the targets. Snap and Skewer held fire until you marked one. You worked the ravine in passes. Methodical. The hides are secured. Snap and Skewer look at you with something like respect. "When the big one comes," Snap says, "we\'ve got your back." The path leads on. The Fallen Elder Tree\'s hollow waits.',
      progress: 1,
      choices: [
        { emoji: '➡️', label: 'Press on to the hollow.', next: 'conv_rite_success' }
      ]
    },
    rite_skewer_falls: {
      title: 'Skewer Falls',
      body: 'You told them to keep the beetles off. Skewer waded in, both pistols up. The time-rot surged. It took him. He aged—years in heartbeats. Where Skewer stood there\'s nothing but his pistols in the muck. Snap doesn\'t scream. He goes very quiet. He recovers the hides. Then it hits him. He cries—raw, ugly sobs. He needs something from you.',
      progress: 1,
      party: ['grimshaw', 'suki', 'kaelen', 'malagant', 'snap'],
      choices: [
        { emoji: '💙', label: 'Insight: Sit with him—a hand on his shoulder, or presence. Let him grieve.', next: 'rite_comfort' },
        { emoji: '🔥', label: 'Persuasion: Remind him why you\'re still moving—Root, the forest, the thing in the hollow.', next: 'rite_encourage' }
      ]
    },
    rite_comfort: {
      title: 'Comfort',
      body: 'You sit with him. He wipes his face, nods, and when he\'s ready he stands. The hides go with you. So does Snap—quieter, but still with you. You press on toward the hollow. The Goblin Flank is broken. One less at your back.',
      progress: 1,
      choices: [{ emoji: '➡️', label: 'Press on to the hollow.', next: 'conv_rite_fell' }]
    },
    rite_encourage: {
      title: 'Encourage',
      body: 'You remind him why you\'re still moving. He grits his teeth, wipes his face, and gets up. The hides go with you. So does Snap—harder now, but still with you. You press on toward the hollow. One less at your back.',
      progress: 1,
      choices: [{ emoji: '➡️', label: 'Press on to the hollow.', next: 'conv_rite_fell' }]
    },
    rite_cycle: {
      title: 'The Ravine Takes You',
      body: 'You went in. The beetles phased in around you. The swarm closed in. Your vision went dark—then the mark on your arm erupted. Your body exploded in a frosted spike ball of pink and ice. Snap and Skewer were thrown back—unhurt. In that timeline, they were saved. Your soul was ripped back through time. You wake. The Fork in the Fallen Forest. The choice is still ahead. This time, you can choose differently.',
      progress: 0,
      party: ['grimshaw', 'suki', 'kaelen', 'malagant', 'snap', 'skewer'],
      choices: [{ emoji: '🔄', label: 'Begin again.', next: 'fork' }]
    },

    echo_path: {
      title: 'The Melody of Lost Time',
      body: 'You go with Kaelen and Malagant toward the bards\' campsite. Gliss and Guile—the feyborn sisters who use their musical charms to lure travelers and harvest their souls—are gone. You faced them when the party first arrived at the Fallen Elder Tree. Their magic might still be here. You and Kaelen met at the academy in Sardawn; she completed her clerical schooling there. You dropped out to study the multiverse with Stellan—before your pact with the Frigidlord. On the path, Kaelen falls in beside you. She\'s quiet a moment, then says: "Do you remember that first day at the academy in Sardawn?" She\'s asking what you remember—the moment that set the tone between you.',
      progress: 1,
      choices: [
        { emoji: '💫', label: 'A moment of charge: The courtyard. She\'d been chewed out by a master; you said something that made her laugh. She turned and looked at you—really looked—and you thought, oh.', next: 'echo_camp', setKaelenMemory: 'flirty' },
        { emoji: '🤝', label: 'A moment of trust: The stacks. You were both hunting the same obscure text. You found it first and handed it to her—you need it more. She didn\'t report you. After that, you had each other\'s backs.', next: 'echo_camp', setKaelenMemory: 'friendly' }
      ]
    },
    echo_camp: {
      title: 'The Siren\'s Loop',
      body: 'The campsite is stuck in a loop. A spectral campfire crackles. Ghostly echoes of Gliss and Guile sing—sweet, drowsy, wrong. Kaelen is already moving. Toward the cliff edge, step by step, eyes half-closed. The song has her. A golden flute hovers in the air, silent, waiting.',
      progress: 1,
      choices: [
        { emoji: '🧠', label: 'Awakened Mind + Dissonant Whispers: Stay back; break the loop from here—reach into her mind and shatter the song.', next: 'echo_success' },
        { emoji: '🗣️', label: 'Awakened Mind: Free Kaelen, then call Malagant to pull her back from the edge.', next: 'echo_malagant_falls' },
        { emoji: '🏃', label: 'Rush in and pull Kaelen back from the edge yourself.', next: 'echo_cycle' }
      ]
    },
    echo_success: {
      title: 'The Loop Shatters',
      body: 'You stayed back. You reached into Kaelen\'s mind; you cast at the spectral song itself. The loop shattered. The campfire guttered. Kaelen stumbled back; Malagant steadied her. You found a journal among the bards\' things—the spider, a weakness: Harmonic Resonance, force damage. Tactical insight for the fight to come. The path leads on. The hollow waits.',
      progress: 1,
      choices: [{ emoji: '➡️', label: 'Press on to the hollow.', next: 'conv_echo_success' }]
    },
    echo_malagant_falls: {
      title: 'Malagant Lost',
      body: 'You broke the charm. Kaelen snapped free. You shouted at Malagant to pull her back. She ran in—and saw the golden flute. It lured her. The flute glowed red. Her loop accelerated. A flash of red light. Gliss and Guile. They\'ve abducted Malagant to another plane. Kaelen breaks. She needs something from you.',
      progress: 1,
      party: ['grimshaw', 'suki', 'kaelen', 'snap', 'skewer'],
      choices: [
        { emoji: '💙', label: 'Insight: Sit with her. Hold her, or be there. Let her grieve.', next: 'echo_console' },
        { emoji: '⚔️', label: 'Persuasion: Vow to make it right—find Gliss and Guile, get Malagant back or end them.', next: 'echo_vow' }
      ]
    },
    echo_console: {
      title: 'Console Her',
      body: 'You sat with her. When she was ready, you helped her up. You found the journal. You press on toward the hollow with Kaelen beside you. One less at your back.',
      progress: 1,
      choices: [{ emoji: '➡️', label: 'Press on to the hollow.', next: 'conv_echo_fell' }]
    },
    echo_vow: {
      title: 'Vow Vengeance',
      body: 'You told her you\'ll make it right. She looked up, and something hard settled in her eyes. She nodded. "Together." You press on toward the hollow. One less at your back. But not forgotten.',
      progress: 1,
      choices: [{ emoji: '➡️', label: 'Press on to the hollow.', next: 'conv_echo_fell' }]
    },
    echo_cycle: {
      title: 'The Loop Takes You',
      body: 'You ran. You shoved Kaelen back toward Malagant—she\'s free—and then there was nothing under your feet. Your mark erupted. Frosted spike ball. The blast shattered the loop. Kaelen and Malagant were saved. Your soul was ripped back to the Fork. You wake. This time, you can choose differently.',
      progress: 0,
      party: ['grimshaw', 'suki', 'kaelen', 'malagant', 'snap', 'skewer'],
      choices: [{ emoji: '🔄', label: 'Begin again.', next: 'fork' }]
    },

    conv_rite_success: {
      title: 'The Hollow — The Weaver of Rot',
      body: 'The Fallen Elder Tree\'s hollowed roots close around you. Flowers bloom and wither in seconds. Time is sick here. The Chrono-Weaver moves in the hollow—a giant spider, chitin webbed with pink veins, spinning time strands. It has hatchlings. Snap and Skewer spread out; Kaelen and Malagant brace. You have one real choice: kill it, or cure it.',
      progress: 2,
      choices: [
        { emoji: '⚡', label: 'Eldritch Blast + Ice Knife + Hellish Rebuke: End it. Snap and Skewer hold the line; you blast the Weaver.', next: 'grey_ending', history: { convergenceEntry: 'RS', convergenceChoice: 'BR', ending: 'G' } },
        { emoji: '✋', label: 'Armor of Agathys + Mark (pull corruption): Get to melee; press the mark against the Spider and pull the corruption out.', next: 'risky_moment', history: { convergenceEntry: 'RS', convergenceChoice: 'RH' } }
      ]
    },
    conv_rite_fell: {
      title: 'The Hollow — The Weaver of Rot',
      body: 'The hollowed roots close around you. One less than you hoped. The Chrono-Weaver moves in the hollow—pink veins, time strands, hatchlings. Snap readies his sling. Kaelen and Malagant brace. Kill it, or cure it.',
      progress: 2,
      choices: [
        { emoji: '⚡', label: 'Eldritch Blast + Ice Knife + Hellish Rebuke: Blast it. Snap, Kaelen, and Malagant hold the line.', next: 'grey_ending', history: { convergenceEntry: 'RF', convergenceChoice: 'BR', ending: 'G' } },
        { emoji: '✋', label: 'Armor of Agathys + Mark: Get close; pull the corruption out. Snap holds the line—or try.', next: 'risky_moment', history: { convergenceEntry: 'RF', convergenceChoice: 'RH' } },
        { emoji: '🛡️', label: 'Let Snap draw the hatchlings; you use the mark to reach the Weaver and cure it.', next: 'good_snaps_sacrifice', history: { convergenceEntry: 'RF', convergenceChoice: 'SS', ending: 'GS' } }
      ]
    },
    conv_echo_success: {
      title: 'The Hollow — The Weaver of Rot',
      body: 'You\'re all here. The hollowed roots close around you. The Chrono-Weaver moves—pink veins, time strands, hatchlings. You have the journal. Tactical insight: force damage. Kill it, or cure it.',
      progress: 2,
      choices: [
        { emoji: '⚡', label: 'Eldritch Blast (force) + Ice Knife + Hellish Rebuke: Blast it. Everyone holds the line.', next: 'grey_ending', history: { convergenceEntry: 'ES', convergenceChoice: 'BR', ending: 'G' } },
        { emoji: '✋', label: 'Armor of Agathys + Mark: Press the mark and pull the corruption out. Kaelen has your back.', next: 'echo_risky_support', history: { convergenceEntry: 'ES', convergenceChoice: 'RH' } }
      ]
    },
    echo_risky_support: {
      title: 'The Risky Cure — Kaelen\'s Support',
      body: 'You\'ve chosen the Risky Cure. The hollow stinks of rot and ozone. Time-strands brush your skin. The Weaver\'s mandibles click. Hatchlings pour from the shadows. Kaelen is already moving to your side. She knows what you\'re about to do. She\'s going to give you every edge she has. The moment between you goes back years—the academy, the choice you each made. She meets your eyes, and the spell she chooses is the one that belongs to that memory.',
      progress: 2,
      choices: [
        { emoji: '✨', label: 'Bless: That look in the courtyard. Luck and nerve; her voice steady. You\'re ready.', next: 'risky_moment' },
        { emoji: '🛡️', label: 'Shield of Faith: The stacks. Her trust; your backs to each other. A second skin of faith. She has your back.', next: 'risky_moment' }
      ]
    },
    conv_echo_fell: {
      title: 'The Hollow — The Weaver of Rot',
      body: 'Malagant\'s absence like a hole. The hollowed roots close around you. The Chrono-Weaver moves. Kaelen readies herself. Snap and Skewer spread out. Kill it, or cure it.',
      progress: 2,
      choices: [
        { emoji: '💫', label: 'Fight together—like in the courtyard. She marks the Weaver; you strike the opening.', next: 'grey_ending', history: { convergenceEntry: 'EM', convergenceChoice: 'GB', ending: 'G' } },
        { emoji: '🤝', label: 'Fight together—like in the stacks. She closes in first; you back her up.', next: 'grey_ending', history: { convergenceEntry: 'EM', convergenceChoice: 'KS', ending: 'G' }, party: ['grimshaw', 'suki', 'snap', 'skewer'] },
        { emoji: '✋', label: 'Armor of Agathys + Mark: Get close. Kaelen, Snap, and Skewer hold the line—or try.', next: 'risky_moment', history: { convergenceEntry: 'EM', convergenceChoice: 'RH' } }
      ]
    },

    risky_moment: {
      title: 'The Risky Cure',
      body: 'The hollow stinks of rot and ozone. Time-strands brush your skin. The Weaver\'s mandibles click. Hatchlings pour from the shadows. You call Armor of Agathys and move. The mark burns cold. Your allies hold—or they don\'t.',
      progress: 2,
      choices: [
        { emoji: '🛡️', label: 'Your allies form a wall. You move.', next: 'risky_held' },
        { emoji: '🌫️', label: 'The swarm is everywhere. You move.', next: 'risky_broke' }
      ]
    },
    risky_held: {
      title: 'The Line Holds',
      body: 'You reached the Weaver. You pressed the mark and pulled the corruption out. The spider shuddered. The pink veins faded. It reverted—no longer the Chrono-Weaver, just a great spider, free. It revealed the hoard: elemental gems for the baby basilisks. Then an impromptu snow storm hit—brief, fierce. It clears. The temperature drops. Something else is coming.',
      progress: 3,
      choices: [
        { emoji: '➡️', label: 'Continue.', next: '_risky_held_epilogue' }
      ]
    },
    risky_broke: {
      title: 'The Line Breaks',
      body: 'The hatchlings overran your allies. One by one, all of your companions are lost. You\'re cornered, alone. The Weaver\'s mandibles click. The Frigidlord\'s voice is in your head—cold, vast, interested. "The threads are cut. Do you wish to reweave them?"',
      progress: 3,
      party: ['grimshaw', 'suki'],
      choices: [
        { emoji: '💀', label: 'Overload the mark: destroy the threat for the forest. No deal.', next: 'dark_sacrifice', history: { ending: 'D' } },
        { emoji: '❄️', label: 'Accept the Frigidlord\'s deal. Try again.', next: 'dark_loop', history: { ending: 'D' } }
      ]
    },
    dark_sacrifice: {
      title: 'The Sacrifice',
      body: 'You didn\'t take the deal. You took the mark. You let it go—all of it. Your body exploded in a frosted spike ball of pink and ice. The blast tore through the Weaver, the hatchlings. When the light faded, the threat was gone. Whoever you had left were saved in that timeline. So are you. Your soul was ripped back through time. You wake at the Fork. The cycle starts over.',
      progress: 0,
      party: ['grimshaw', 'suki', 'kaelen', 'malagant', 'snap', 'skewer'],
      isEnding: true,
      outcomeCode: true,
      choices: [{ emoji: '🔄', label: 'Begin again.', next: 'fork' }]
    },
    dark_loop: {
      title: 'The Time Loop',
      body: 'You said yes. The world dissolved into snow. White. Endless. You have taken the deal. You wake at the Fork. You are not unchanged. The damage is still with you. The trauma. You have a second chance. The threads can be rewoven. Or cut again.',
      progress: 0,
      isEnding: true,
      outcomeCode: true,
      choices: [{ emoji: '🔄', label: 'Try again.', next: 'fork' }]
    },

    grey_ending: {
      title: 'The Butcher\'s Path',
      body: 'You ended the Weaver by force. The tunnel collapsed. The elemental gems are buried or lost. The cost is written in blood. The impromptu snow storm has cleared. The forest is quiet. The Frigidlord\'s presence is a cold weight at the edge of thought—indifferent. You won. You also lost.',
      progress: 3,
      isEnding: true,
      outcomeCode: true,
      choices: [{ emoji: '➡️', label: 'Continue.', next: 'epilogue_grey' }]
    },
    good_snaps_sacrifice: {
      title: 'Snap\'s Sacrifice',
      body: 'Snap met your eyes. He ran at the hatchlings—sling cracking, shouting—and drew them onto himself. You had an opening. You touched the Weaver. You pulled the corruption out. The spider reverted. The hoard was revealed. Kaelen and Malagant are alive. Snap didn\'t make it. The temperature is dropping. Something else is coming.',
      progress: 3,
      party: ['grimshaw', 'suki', 'kaelen', 'malagant', 'skewer'],
      isEnding: true,
      outcomeCode: true,
      choices: [{ emoji: '➡️', label: 'Continue.', next: 'epilogue_snaps' }]
    }
  };

  // Epilogue routing: risky_held goes to different epilogue by party
  function getRiskyHeldEpilogue() {
    var p = getParty();
    if (p.indexOf('skewer') === -1 && p.indexOf('snap') !== -1) return 'epilogue_no_skewer';
    if (p.indexOf('malagant') === -1) return 'epilogue_no_malagant';
    return 'epilogue_all_four';
  }

  var epilogues = {
    epilogue_all_four: {
      title: 'The Winter Cyclone — All Four',
      body: 'The snow storm has cleared. The temperature plummets again. Above the canopy, the sky tears. A Winter Cyclone forms. The eye of the storm holds you. The Frigidlord. Head of a snow leopard. Body of a reindeer. Wings of an owl. The eye is Curious. Interested. You saved the Weaver. You claimed the hoard. Snap, Skewer, Kaelen, and Malagant stand with you—bloody, breathing, alive. All four. No one was left behind. His voice is pressure in your mind: there is a great disturbance at the woodmill. Stellan is again in danger. The Frigidlord descends. He asks you and Suki to jump upon his back. You mount the Elder God. You rise. The Rotting Tides of Time—end.',
      progress: 4,
      isEnding: true,
      outcomeCode: true,
      goodEnding: true,
      choices: []
    },
    epilogue_no_skewer: {
      title: 'The Winter Cyclone',
      body: 'The snow storm has cleared. The Frigidlord appears—snow leopard, reindeer, owl. The eye is Curious. Interested. You saved the Weaver. Snap, Kaelen, and Malagant stand with you. Skewer\'s absence is a weight none of you name. The Frigidlord speaks in your mind: the woodmill, Stellan, danger. He asks you and Suki to mount. You rise. The Rotting Tides of Time—end.',
      progress: 4,
      isEnding: true,
      outcomeCode: true,
      goodEnding: true,
      choices: []
    },
    epilogue_no_malagant: {
      title: 'The Winter Cyclone',
      body: 'The snow storm has cleared. The Frigidlord appears. The eye is Curious. Interested. You saved the Weaver. Snap, Skewer, and Kaelen stand with you. Malagant\'s absence is a hole. The Frigidlord speaks: the woodmill, Stellan. You mount. You rise. The Rotting Tides of Time—end.',
      progress: 4,
      isEnding: true,
      outcomeCode: true,
      goodEnding: true,
      choices: []
    },
    epilogue_snaps: {
      title: 'The Winter Cyclone',
      body: 'The snow storm has cleared. The Frigidlord appears. The eye is Curious. Interested. Kaelen and Malagant stand with you. Skewer at the ravine. Snap at the hollow—his sling still, his voice gone. You won\'t forget what they gave. The Frigidlord speaks. You mount. You rise. The Rotting Tides of Time—end.',
      progress: 4,
      isEnding: true,
      outcomeCode: true,
      goodEnding: true,
      choices: []
    },
    epilogue_grey: {
      title: 'The Winter Cyclone — The Butcher\'s Path',
      body: 'The snow storm has cleared. The Frigidlord appears. The eye is Indifferent. You ended the Weaver by force. The cost is written in blood. Whoever stood with you is accounted for. The Frigidlord speaks: the woodmill, Stellan. You mount. You rise. The Rotting Tides of Time—end.',
      progress: 4,
      isEnding: true,
      outcomeCode: true,
      choices: []
    }
  };

  function getScene(id) {
    if (id === '_risky_held_epilogue') id = getRiskyHeldEpilogue();
    return scenes[id] || epilogues[id] || null;
  }

  function applyChoice(choice, scene) {
    var nextId = choice.next;
    if (choice.setPath) setPath(choice.setPath);
    if (choice.setKaelenMemory) setKaelenMemory(choice.setKaelenMemory);
    if (choice.party) setParty(choice.party);
    else if (scene.party) setParty(scene.party);
    if (choice.history) {
      pushHistory(choice.history);
      if (choice.history.party) setParty(choice.history.party);
    }
    if (nextId === '_risky_held_epilogue') {
      var ep = getRiskyHeldEpilogue();
      var endCode = ep === 'epilogue_all_four' ? 'GAF' : ep === 'epilogue_no_skewer' ? 'GNS' : 'GNM';
      pushHistory({ ending: endCode });
      nextId = ep;
    }
    var nextScene = getScene(nextId);
    if (nextScene && nextScene.progress != null) setProgress(nextScene.progress);
    setSceneId(nextId);
    if (nextScene && (nextScene.isEnding || nextScene.outcomeCode)) computeOutcomeCode();
    return nextId;
  }

  function reset() {
    state.sceneId = 'fork';
    state.path = null;
    state.kaelenMemory = null;
    state.party = ['grimshaw', 'suki', 'kaelen', 'malagant', 'snap', 'skewer'];
    state.progress = 0;
    state.history = [];
    state.outcomeCode = null;
  }

  window.RottingTides = {
    PARTY_IDS: PARTY_IDS,
    PROGRESS_HUBS: PROGRESS_HUBS,
    getParty: getParty,
    getProgress: getProgress,
    getPath: getPath,
    getSceneId: getSceneId,
    getOutcomeCode: getOutcomeCode,
    getKaelenMemory: getKaelenMemory,
    getScene: getScene,
    applyChoice: applyChoice,
    reset: reset,
    state: state
  };
})();

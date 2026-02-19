/**
 * Smart Course Builder – AI-assisted course generation, quizzes, assessments, tests, assignments.
 * Comprehensive templates for goat farming and general topics (swap for real API when backend available).
 */
(function () {
  var COURSES_KEY = 'aphamo_admin_courses';

  var GOAT_COURSE = {
    title: 'Complete Goat Farming & Husbandry Programme',
    description: 'A comprehensive course on goat farming and husbandry tailored for South African conditions. Covers breed selection, housing, feeding, health management, breeding, record-keeping, and market readiness for aggregation programmes. Designed for emerging farmers, beneficiaries, and anyone building a sustainable goat enterprise.',
    modules: [
      { title: 'Introduction to Goat Farming', content: 'Overview of the goat industry in South Africa. Opportunities for smallholder and emerging farmers. Key success factors and common challenges.' },
      { title: 'Breeds and Selection', content: 'Boer, indigenous, and dual-purpose breeds. Selecting stock for your conditions. Breeding goals: meat, milk, or fibre.' },
      { title: 'Housing and Shelter', content: 'Designing pens and shelters. Ventilation, drainage, and predator protection. Stocking densities and space requirements.' },
      { title: 'Feeding and Nutrition', content: 'Pasture and browse management. Supplementary feeding. Minerals and water. Feeding kids and lactating does.' },
      { title: 'Herd Health and Disease Prevention', content: 'Vaccination programmes (e.g. clostridial). Internal parasites and drenching. Recognising sick animals. Biosecurity basics.' },
      { title: 'Breeding and Reproduction', content: 'Breeding seasons. Buck management. Pregnancy and kidding. Care of newborns.' },
      { title: 'Record-Keeping and Management', content: 'Production records, health records, and financial tracking. Using records for better decisions.' },
      { title: 'Market Readiness and Sales', content: 'Preparing goats for market. Live weight and grading. Connecting with buyers and aggregation programmes.' }
    ],
    quizQuestions: [
      { q: 'Which breed is known for high meat production in South Africa?', opts: ['Boer', 'Saanen', 'Nubian', 'Toggenburg'], correct: 0 },
      { q: 'What is the recommended stocking rate for goats per hectare on good veld?', opts: ['2–4', '6–8', '10–12', '15+'], correct: 0 },
      { q: 'Which vaccination is essential for goat herds?', opts: ['Clostridial', 'Rabies only', 'None required', 'Seasonal flu'], correct: 0 },
      { q: 'How often should production records be updated?', opts: ['Monthly', 'Quarterly', 'Annually', 'Never'], correct: 0 },
      { q: 'What is the most common cause of kid mortality in the first 48 hours?', opts: ['Hypothermia and starvation', 'Predators', 'Disease', 'Accidents'], correct: 0 },
      { q: 'Which nutrient is critical for bone development in kids?', opts: ['Calcium and phosphorus', 'Vitamin C only', 'Fat', 'Sugar'], correct: 0 },
      { q: 'Good drainage in goat pens helps prevent:', opts: ['Foot rot and parasite buildup', 'Overeating', 'Aggression', 'Sunburn'], correct: 0 },
      { q: 'What should you record when a doe kids?', opts: ['Date, number of kids, weights', 'Only the date', 'Nothing', 'Vet costs only'], correct: 0 }
    ],
    assignments: [
      { title: 'Draw a simple layout for a 20-goat pen', instructions: 'Include feed troughs, water points, shelter, and handling facilities. Note materials you would use locally.' },
      { title: 'Create a 12‑month vaccination and drenching calendar', instructions: 'List products, doses, and timing for your herd size.' }
    ]
  };

  var GENERAL_TOPICS = {
    'business': {
      modules: ['Introduction to Business', 'Planning and Strategy', 'Marketing Basics', 'Financial Management', 'Operations', 'Growth and Scaling'],
      description: 'A structured business fundamentals course covering planning, marketing, finance, and operations for small enterprises.',
      quizQuestions: [
        { q: 'What is a business plan primarily used for?', opts: ['Guiding strategy and securing finance', 'Legal compliance only', 'Marketing', 'Hiring'], correct: 0 },
        { q: 'Cash flow measures:', opts: ['Money in and out over time', 'Total profit', 'Assets only', 'Employee count'], correct: 0 }
      ]
    },
    'agriculture': {
      modules: ['Introduction to Farming', 'Soil and Land', 'Crop and Livestock Basics', 'Pest and Disease Management', 'Harvest and Post-Harvest', 'Marketing Farm Produce'],
      description: 'An introductory agriculture course covering soils, crops, livestock basics, and farm business.',
      quizQuestions: [
        { q: 'Soil fertility is improved by:', opts: ['Organic matter and correct pH', 'Only chemicals', 'Irrigation alone', 'Nothing'], correct: 0 },
        { q: 'Integrated pest management aims to:', opts: ['Reduce pesticides with multiple strategies', 'Use more chemicals', 'Ignore pests', 'Sell infected produce'], correct: 0 }
      ]
    }
  };

  function generateFromTopic(topic) {
    var t = (topic || '').toLowerCase().trim();
    var isGoat = /goat|husbandry|farming|aggregation|livestock|animal/.test(t);
    var isBusiness = /business|entrepreneur|start.?up|enterprise/.test(t);
    var isAgri = /agriculture|farm|crop|soil/.test(t) && !isGoat;

    var course;
    if (isGoat) {
      course = {
        title: GOAT_COURSE.title,
        description: GOAT_COURSE.description,
        modules: GOAT_COURSE.modules.map(function (m, i) {
          return {
            id: 'mod_' + Date.now() + '_' + i,
            title: m.title,
            content: m.content || '',
            materials: [],
            videoUrl: ''
          };
        }),
        quizQuestions: GOAT_COURSE.quizQuestions,
        assignments: GOAT_COURSE.assignments || []
      };
    } else if (isBusiness && GENERAL_TOPICS.business) {
      var bt = GENERAL_TOPICS.business;
      course = {
        title: (topic || 'Business') + ' – Fundamentals',
        description: bt.description,
        modules: bt.modules.map(function (m, i) {
          return { id: 'mod_' + Date.now() + '_' + i, title: m, content: '', materials: [], videoUrl: '' };
        }),
        quizQuestions: bt.quizQuestions,
        assignments: []
      };
    } else if (isAgri && GENERAL_TOPICS.agriculture) {
      var at = GENERAL_TOPICS.agriculture;
      course = {
        title: (topic || 'Agriculture') + ' – Introduction',
        description: at.description,
        modules: at.modules.map(function (m, i) {
          return { id: 'mod_' + Date.now() + '_' + i, title: m, content: '', materials: [], videoUrl: '' };
        }),
        quizQuestions: at.quizQuestions,
        assignments: []
      };
    } else {
      var defaultModules = ['Module 1: Introduction', 'Module 2: Core Concepts', 'Module 3: Practical Application', 'Module 4: Assessment & Review'];
      course = {
        title: topic || 'New Course',
        description: 'A structured learning programme covering essential topics. Complete each module and pass the assessments to earn your certificate.',
        modules: defaultModules.map(function (m, i) {
          return { id: 'mod_' + Date.now() + '_' + i, title: m, content: '', materials: [], videoUrl: '' };
        }),
        quizQuestions: [
          { q: 'What is the main topic of this course?', opts: [(topic || 'This subject'), 'Something else', 'Not sure', 'N/A'], correct: 0 },
          { q: 'How many modules does this course have?', opts: [String(defaultModules.length), '1', '10', 'None'], correct: 0 }
        ],
        assignments: []
      };
    }
    return course;
  }

  function genId() { return 'cb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9); }

  function getCourses() {
    try {
      var raw = localStorage.getItem(COURSES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function setCourses(courses) {
    try {
      localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
      return true;
    } catch (e) { return false; }
  }

  window.AphamoCourseBuilder = {
    generateWithAI: generateFromTopic,

    getCourse: function (id) {
      return getCourses().find(function (c) { return c.id === id; });
    },

    updateCourse: function (id, updates) {
      var courses = getCourses();
      var idx = courses.findIndex(function (c) { return c.id === id; });
      if (idx < 0) return false;
      Object.keys(updates || {}).forEach(function (k) {
        if (updates[k] !== undefined) courses[idx][k] = updates[k];
      });
      return setCourses(courses);
    },

    addModule: function (courseId, module) {
      var c = this.getCourse(courseId);
      if (!c) return null;
      c.modules = c.modules || [];
      var m = {
        id: genId(),
        title: module.title || '',
        content: module.content || '',
        materials: module.materials || [],
        videoUrl: module.videoUrl || '',
        liveSessionUrl: module.liveSessionUrl || '',
        activityType: module.activityType || '',
        activityId: module.activityId || ''
      };
      c.modules.push(m);
      return this.updateCourse(courseId, { modules: c.modules }) ? m.id : null;
    },

    updateModule: function (courseId, moduleId, updates) {
      var c = this.getCourse(courseId);
      if (!c) return false;
      var mod = (c.modules || []).find(function (m) { return m.id === moduleId; });
      if (!mod) return false;
      if (updates.videoUrl !== undefined) mod.videoUrl = updates.videoUrl || '';
      if (updates.liveSessionUrl !== undefined) mod.liveSessionUrl = updates.liveSessionUrl || '';
      if (updates.activityType !== undefined) mod.activityType = updates.activityType || '';
      if (updates.activityId !== undefined) mod.activityId = updates.activityId || '';
      if (updates.title !== undefined) mod.title = updates.title || '';
      if (updates.content !== undefined) mod.content = updates.content || '';
      return this.updateCourse(courseId, { modules: c.modules });
    },

    deleteModule: function (courseId, moduleId) {
      var c = this.getCourse(courseId);
      if (!c) return false;
      c.modules = (c.modules || []).filter(function (m) { return m.id !== moduleId; });
      return this.updateCourse(courseId, { modules: c.modules });
    },

    addMaterial: function (courseId, moduleId, material) {
      var c = this.getCourse(courseId);
      if (!c) return false;
      var mod = (c.modules || []).find(function (m) { return m.id === moduleId; });
      if (!mod) return false;
      mod.materials = mod.materials || [];
      mod.materials.push(material);
      return this.updateCourse(courseId, { modules: c.modules });
    },

    addQuiz: function (courseId, quiz) {
      var c = this.getCourse(courseId);
      if (!c) return null;
      c.quizzes = c.quizzes || [];
      var q = { id: genId(), title: quiz.title || 'Quiz', questions: quiz.questions || [] };
      c.quizzes.push(q);
      return this.updateCourse(courseId, { quizzes: c.quizzes }) ? q.id : null;
    },

    addAssessment: function (courseId, assessment) {
      var c = this.getCourse(courseId);
      if (!c) return null;
      c.assessments = c.assessments || [];
      var a = { id: genId(), title: assessment.title || 'Assessment', questions: assessment.questions || [] };
      c.assessments.push(a);
      return this.updateCourse(courseId, { assessments: c.assessments }) ? a.id : null;
    },

    addAssignment: function (courseId, assignment) {
      var c = this.getCourse(courseId);
      if (!c) return null;
      c.assignments = c.assignments || [];
      var a = { id: genId(), title: assignment.title || '', description: assignment.description || '', instructions: assignment.instructions || '', dueDate: assignment.dueDate || '' };
      c.assignments.push(a);
      return this.updateCourse(courseId, { assignments: c.assignments }) ? a.id : null;
    },

    addTest: function (courseId, test) {
      var c = this.getCourse(courseId);
      if (!c) return null;
      c.tests = c.tests || [];
      var t = { id: genId(), title: test.title || 'Test', questions: test.questions || [], timeLimit: test.timeLimit || 0 };
      c.tests.push(t);
      return this.updateCourse(courseId, { tests: c.tests }) ? t.id : null;
    },

    addQuestion: function (courseId, type, itemId, question) {
      var c = this.getCourse(courseId);
      if (!c) return null;
      var arr = type === 'quiz' ? c.quizzes : type === 'assessment' ? c.assessments : c.tests;
      arr = arr || [];
      var item = arr.find(function (x) { return x.id === itemId; });
      if (!item) return null;
      item.questions = item.questions || [];
      var q = {
        id: genId(),
        questionType: question.questionType || 'multiple_choice',
        question: question.question || '',
        options: question.options || [],
        correctIndex: typeof question.correctIndex === 'number' ? question.correctIndex : 0
      };
      if (q.questionType === 'true_false') {
        q.options = ['True', 'False'];
        q.correctIndex = question.correctIndex === 1 ? 1 : 0;
      }
      if (q.questionType === 'fill_blank') {
        q.blanks = Array.isArray(question.blanks) ? question.blanks : (question.blanks ? [question.blanks] : []);
      }
      if (q.questionType === 'match') {
        q.leftItems = Array.isArray(question.leftItems) ? question.leftItems : [];
        q.rightItems = Array.isArray(question.rightItems) ? question.rightItems : [];
        q.correctPairs = Array.isArray(question.correctPairs) ? question.correctPairs : [];
      }
      item.questions.push(q);
      if (type === 'quiz') return this.updateCourse(courseId, { quizzes: c.quizzes });
      if (type === 'assessment') return this.updateCourse(courseId, { assessments: c.assessments });
      return this.updateCourse(courseId, { tests: c.tests });
    },

    deleteQuiz: function (courseId, quizId) {
      var c = this.getCourse(courseId);
      if (!c) return false;
      c.quizzes = (c.quizzes || []).filter(function (q) { return q.id !== quizId; });
      return this.updateCourse(courseId, { quizzes: c.quizzes });
    },

    deleteAssessment: function (courseId, assessmentId) {
      var c = this.getCourse(courseId);
      if (!c) return false;
      c.assessments = (c.assessments || []).filter(function (a) { return a.id !== assessmentId; });
      return this.updateCourse(courseId, { assessments: c.assessments });
    },

    deleteAssignment: function (courseId, assignmentId) {
      var c = this.getCourse(courseId);
      if (!c) return false;
      c.assignments = (c.assignments || []).filter(function (a) { return a.id !== assignmentId; });
      return this.updateCourse(courseId, { assignments: c.assignments });
    },

    deleteTest: function (courseId, testId) {
      var c = this.getCourse(courseId);
      if (!c) return false;
      c.tests = (c.tests || []).filter(function (t) { return t.id !== testId; });
      return this.updateCourse(courseId, { tests: c.tests });
    },

    duplicateCourse: function (courseId) {
      var c = this.getCourse(courseId);
      if (!c) return null;
      var idMap = {};
      var copyQ = function (qq) {
        var o = { id: genId(), questionType: qq.questionType || 'multiple_choice', question: qq.question || '', options: (qq.options || []).slice(), correctIndex: qq.correctIndex };
        if (qq.blanks) o.blanks = qq.blanks.slice();
        if (qq.leftItems) o.leftItems = qq.leftItems.slice();
        if (qq.rightItems) o.rightItems = qq.rightItems.slice();
        if (qq.correctPairs) o.correctPairs = qq.correctPairs.slice();
        return o;
      };
      var quizzes = (c.quizzes || []).map(function (q) {
        var id = genId();
        idMap[q.id] = id;
        return { id: id, title: q.title || 'Quiz', questions: (q.questions || []).map(copyQ) };
      });
      var assessments = (c.assessments || []).map(function (a) {
        var id = genId();
        idMap[a.id] = id;
        return { id: id, title: a.title || 'Assessment', questions: (a.questions || []).map(copyQ) };
      });
      var tests = (c.tests || []).map(function (t) {
        var id = genId();
        idMap[t.id] = id;
        return { id: id, title: t.title || 'Test', questions: (t.questions || []).map(copyQ), timeLimit: t.timeLimit || 0 };
      });
      var modules = (c.modules || []).map(function (m) {
        return { id: genId(), title: m.title || '', content: m.content || '', materials: m.materials || [], videoUrl: m.videoUrl || '', liveSessionUrl: m.liveSessionUrl || '', activityType: m.activityType || '', activityId: m.activityId ? (idMap[m.activityId] || m.activityId) : '' };
      });
      var assignments = (c.assignments || []).map(function (a) {
        return { id: genId(), title: a.title || '', description: a.description || '', instructions: a.instructions || '', dueDate: a.dueDate || '' };
      });
      var newCourse = {
        id: genId(),
        title: (c.title || 'Course') + ' (copy)',
        description: c.description || '',
        videoUrl: c.videoUrl || '',
        materials: (c.materials || []).slice(),
        locked: !!c.locked,
        published: false,
        createdAt: new Date().toISOString(),
        modules: modules,
        quizzes: quizzes,
        assessments: assessments,
        tests: tests,
        assignments: assignments
      };
      var courses = getCourses();
      courses.push(newCourse);
      return setCourses(courses) ? newCourse.id : null;
    },

    MAX_FILE_SIZE: 150 * 1024
  };
})();

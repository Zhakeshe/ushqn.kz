import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, ArrowRight, Plus, Minus, Menu, X } from 'lucide-react'
import { AppPageMeta } from '../components/AppPageMeta'
import { useAuth } from '../hooks/useAuth'
import { useCopy } from '../product/useCopy'
import '../product/pitch.css'

function Spark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M50 0h20v30h10V20h20v20H90v10h30v20H90v10h10v20H80V90H70v30H50V90H40v10H20V80h10V70H0V50h30V40H20V20h20v10h10V0Z" />
    </svg>
  )
}

export function LandingPage() {
  const copy = useCopy()
  const { i18n } = useTranslation()
  const { session } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const [faq, setFaq] = useState<number | null>(0)
  const destination = session ? '/home' : '/register'
  const cta = session
    ? copy('В кабинет', 'Кабинетке', 'Open dashboard')
    : copy('Создать портфолио', 'Портфолио құру', 'Build my portfolio')
  const modules = [
    {
      name: copy('Портфолио', 'Портфолио', 'Portfolio'),
      label: 'YOUR STORY',
      title: copy(
        'Ты — больше,\nчем оценки.',
        'Сен — бағаларыңнан\nда артықсың.',
        'You are more\nthan your grades.',
      ),
      body: copy(
        'Проекты, сертификаты, спорт и творчество. Всё, что ты умеешь, в одном профиле. Поделись им одной ссылкой.',
        'Жобалар, сертификаттар, спорт және шығармашылық. Білгеніңнің бәрі бір профильде. Бір сілтемемен бөліс.',
        'Projects, certificates, sports and creativity. Everything you can do, in one profile. Share it with a single link.',
      ),
      action: copy(
        'Собрать портфолио',
        'Портфолио жинау',
        'Build your portfolio',
      ),
      path: '/profile',
    },
    {
      name: copy('Рейтинг', 'Рейтинг', 'Rankings'),
      label: 'YOUR PROGRESS',
      title: copy(
        'Пусть достижения\nговорят за тебя.',
        'Жетістіктерің\nөзіңді танытсын.',
        'Let achievements\nspeak for you.',
      ),
      body: copy(
        'Отправляй достижения на проверку и получай баллы. Следи за своим развитием в робототехнике, науке, спорте и других направлениях.',
        'Жетістіктеріңді тексеруге жіберіп, ұпай ал. Робототехника, ғылым, спорт және басқа бағыттардағы дамуыңды бақыла.',
        'Submit achievements for review and earn points. Track your growth in robotics, science, sports and more.',
      ),
      action: copy('Открыть рейтинг', 'Рейтингті ашу', 'Explore rankings'),
      path: '/rating',
    },
    {
      name: copy('Олимпиады', 'Олимпиадалар', 'Olympiads'),
      label: 'YOUR CHALLENGE',
      title: copy(
        'Новый вызов.\nНовый уровень.',
        'Жаңа сын-қатер.\nЖаңа деңгей.',
        'New challenge.\nNew level.',
      ),
      body: copy(
        'Онлайн-тесты с таймером и результатом после завершения. Находи соревнования и проверяй, на что способен.',
        'Таймері бар онлайн тесттер және аяқтағаннан кейінгі нәтиже. Жарыс тап және өз мүмкіндігіңді сына.',
        'Timed online tests with results when you finish. Find competitions and put your skills to the test.',
      ),
      action: copy('Найти олимпиаду', 'Олимпиада табу', 'Find a competition'),
      path: '/olympiads',
    },
    {
      name: copy('Профориентация', 'Кәсіби бағдар', 'Career guidance'),
      label: 'YOUR DIRECTION',
      title: copy(
        'Найди то,\nчто зажигает.',
        'Өзіңді\nшабыттандыратын істі тап.',
        'Find what\nlights you up.',
      ),
      body: copy(
        'Выбери интересы, познакомься с направлениями и составь первые шаги. Сейчас — базовые рекомендации; AI-наставник появится позже.',
        'Қызығушылықтарыңды таңдап, бағыттармен таныс және алғашқы қадамдарды жоспарла. Әзірге негізгі ұсыныстар; AI-тәлімгер кейін қосылады.',
        'Choose interests, explore directions and plan your first steps. Basic suggestions are available now; an AI mentor is planned.',
      ),
      action: copy(
        'Выбрать направление',
        'Бағыт таңдау',
        'Find your direction',
      ),
      path: '/roadmap',
    },
    {
      name: copy('Маркетплейс', 'Маркетплейс', 'Marketplace'),
      label: 'YOUR KNOWLEDGE',
      title: copy(
        'Умеешь сам?\nНаучи другого.',
        'Өзің білесің бе?\nБасқаға үйрет.',
        'Know something?\nPass it on.',
      ),
      body: copy(
        'Репетиторство, менторство и консультации. Находи наставников или предлагай свои услуги. Общение напрямую, без оплаты на платформе.',
        'Репетиторлық, тәлімгерлік және кеңес. Тәлімгер тап немесе өз қызметіңді ұсын. Тікелей байланыс, платформада төлем жоқ.',
        'Tutoring, mentoring and consultations. Find a mentor or offer your skills. Direct contact; platform payments are not available.',
      ),
      action: copy('Найти наставника', 'Тәлімгер табу', 'Find a mentor'),
      path: '/marketplace',
    },
  ]
  const questions = [
    [
      copy('Для кого USHQN?', 'USHQN кімге арналған?', 'Who is USHQN for?'),
      copy(
        'Для школьников и студентов, которые хотят собрать достижения, развивать навыки и осознанно выбрать следующий шаг.',
        'Жетістіктерін жинап, дағдыларын дамытып, келесі қадамын саналы таңдағысы келетін оқушылар мен студенттерге.',
        'For school and university students who want to collect achievements, develop skills and choose their next step intentionally.',
      ),
    ],
    [
      copy('Это бесплатно?', 'Бұл тегін бе?', 'Is it free?'),
      copy(
        'Создать профиль и собрать базовое портфолио можно бесплатно. Стоимость услуг наставников указана в их объявлениях.',
        'Профиль құрып, негізгі портфолио жинау тегін. Тәлімгерлер қызметінің бағасы хабарландыруларында көрсетіледі.',
        'Creating a profile and a core portfolio is free. Mentors list their own service prices.',
      ),
    ],
    [
      copy(
        'Как подтверждаются достижения?',
        'Жетістіктер қалай расталады?',
        'How are achievements verified?',
      ),
      copy(
        'Добавь описание и подтверждающий файл. После проверки уполномоченным сотрудником достижению присваивается статус и начисляются баллы.',
        'Сипаттама мен растайтын файлды қос. Уәкілетті қызметкер тексергеннен кейін жетістікке мәртебе беріліп, ұпай есептеледі.',
        'Add a description and supporting file. An authorized reviewer checks the achievement before a status and points are assigned.',
      ),
    ],
    [
      copy(
        'Что делать после регистрации?',
        'Тіркелгеннен кейін не істеймін?',
        'What happens after registration?',
      ),
      copy(
        'Если требуется, подтверди email по ссылке в письме. Затем заполни короткий профиль — и попадёшь в личный кабинет.',
        'Қажет болса, хаттағы сілтеме арқылы email-ді раста. Содан кейін қысқа профильді толтырып, жеке кабинетке өтесің.',
        'Confirm your email using the link in your inbox if required. Then complete a short profile to enter your dashboard.',
      ),
    ],
  ]
  const active = modules[selected]
  return (
    <div className="pitch-site" id="top">
      <AppPageMeta
        title={copy(
          'Твой путь начинается здесь',
          'Сенің жолың осы жерден басталады',
          'Your journey starts here',
        )}
      />
      <a href="#main" className="ushqn-skip-link">
        {copy('К содержимому', 'Мазмұнға өту', 'Skip to content')}
      </a>
      <header className="pitch-header">
        <Link to="/" className="pitch-brand" aria-label="USHQN">
          <Spark />
          ushqn
        </Link>
        <nav
          className={menuOpen ? 'pitch-links open' : 'pitch-links'}
          aria-label={copy('Навигация', 'Навигация', 'Navigation')}
        >
          {[
            ['#platform', copy('Платформа', 'Платформа', 'Platform')],
            [
              '#journey',
              copy('Как начать', 'Қалай бастау керек', 'How to start'),
            ],
            ['#faq', 'FAQ'],
          ].map(([href, label]) => (
            <a href={href} key={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="pitch-header-actions">
          <label className="sr-only" htmlFor="landing-language">
            {copy('Язык', 'Тіл', 'Language')}
          </label>
          <select
            id="landing-language"
            value={i18n.language.split('-')[0]}
            onChange={(e) => void i18n.changeLanguage(e.target.value)}
          >
            <option value="kk">ҚАЗ</option>
            <option value="ru">RU</option>
            <option value="en">EN</option>
          </select>
          <Link to={session ? '/home' : '/login'} className="pitch-login">
            {session
              ? copy('Кабинет', 'Кабинет', 'Dashboard')
              : copy('Войти', 'Кіру', 'Sign in')}
            <ArrowUpRight size={14} />
          </Link>
          <button
            type="button"
            className="pitch-menu"
            aria-label={copy('Меню', 'Мәзір', 'Menu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      <main id="main">
        <section className="pitch-hero">
          <div className="pitch-meta">
            <span>
              {copy(
                'Казахстан / платформа талантов',
                'Қазақстан / таланттар платформасы',
                'Kazakhstan / talent platform',
              )}
            </span>
            <span>From Spark to Success</span>
          </div>
          <h1>
            USHQN<span className="pitch-title-star">✦</span>
          </h1>
          <div className="pitch-hero-bottom">
            <p className="pitch-statement">
              {copy(
                'Твои цели.\nТвой путь.\nТвои возможности.',
                'Сенің мақсатың.\nСенің жолың.\nСенің мүмкіндіктерің.',
                'Your goals.\nYour journey.\nYour possibilities.',
              )}
            </p>
            <div className="pitch-hero-summary">
              <p>
                {copy(
                  'Собери всё, чем гордишься.\nИ реши, что будет дальше.',
                  'Мақтан тұтатын істеріңді жина.\nКелесі қадамыңды өзің таңда.',
                  'Bring together what makes you proud.\nThen choose what comes next.',
                )}
              </p>
              <Link to={destination} className="pitch-button">
                {cta}
                <ArrowUpRight size={20} />
              </Link>
              <span className="pitch-note">
                {copy(
                  'Базовое портфолио — бесплатно',
                  'Негізгі портфолио — тегін',
                  'Your core portfolio is free',
                )}
              </span>
            </div>
            <div className="pitch-spark-art" aria-hidden="true">
              <Spark />
              <span>✦</span>
              <i>YOUR NEXT CHAPTER</i>
            </div>
          </div>
          <div className="pitch-hero-rail">
            <span>PORTFOLIO</span>
            <span>GROWTH</span>
            <span>OPPORTUNITIES</span>
            <a href="#platform">{copy('Исследовать', 'Танысу', 'Explore')} ↓</a>
          </div>
        </section>
        <section className="pitch-section" id="platform">
          <div className="pitch-section-label">
            01 / {copy('Платформа', 'Платформа', 'Platform')}
          </div>
          <div className="pitch-heading-row">
            <h2>
              {copy(
                'Всё твоё.\nВ одном месте.',
                'Барлық жетістігің.\nБір жерде.',
                'All of you.\nIn one place.',
              )}
            </h2>
            <p>
              {copy(
                'Не теряй свои достижения.\nПревращай их в новые возможности.',
                'Жетістіктеріңді жоғалтпа.\nОларды жаңа мүмкіндікке айналдыр.',
                'Keep your achievements together.\nTurn them into new opportunities.',
              )}
            </p>
          </div>
          <div className="pitch-modules">
            <div
              className="pitch-module-tabs"
              role="tablist"
              aria-label={copy(
                'Возможности платформы',
                'Платформа мүмкіндіктері',
                'Platform modules',
              )}
            >
              {modules.map((m, index) => (
                <button
                  type="button"
                  role="tab"
                  id={`module-tab-${index}`}
                  aria-controls={`module-panel-${index}`}
                  aria-selected={selected === index}
                  key={m.path}
                  onClick={() => setSelected(index)}
                  onKeyDown={(e) => {
                    if (
                      ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)
                    ) {
                      e.preventDefault()
                      const next =
                        e.key === 'Home'
                          ? 0
                          : e.key === 'End'
                            ? modules.length - 1
                            : (index +
                                (e.key === 'ArrowDown' ? 1 : -1) +
                                modules.length) %
                              modules.length
                      setSelected(next)
                      document.getElementById(`module-tab-${next}`)?.focus()
                    }
                  }}
                  tabIndex={selected === index ? 0 : -1}
                >
                  <span>0{index + 1}</span>
                  {m.name}
                  <ArrowUpRight size={20} />
                </button>
              ))}
            </div>
            <article
              className="pitch-module-detail"
              id={`module-panel-${selected}`}
              role="tabpanel"
              aria-labelledby={`module-tab-${selected}`}
            >
              <span className="pitch-module-kicker">{active.label}</span>
              <h3>{active.title}</h3>
              <p>{active.body}</p>
              <Link to={session ? active.path : '/register'}>
                {active.action}
                <ArrowUpRight size={18} />
              </Link>
              <span className="pitch-module-number">0{selected + 1}</span>
            </article>
          </div>
        </section>
        <section className="pitch-section pitch-journey" id="journey">
          <div className="pitch-section-label">
            02 / {copy('Твой первый шаг', 'Алғашқы қадамың', 'Your first step')}
          </div>
          <h2>
            {copy('Начни с себя.', 'Өзіңнен баста.', 'Start with yourself.')}
          </h2>
          <ol>
            {[
              [
                copy('Создай профиль', 'Профиль құр', 'Create your profile'),
                copy(
                  'Кто ты, что любишь и к чему стремишься.',
                  'Сен кімсің, нені ұнатасың және неге ұмтыласың.',
                  'Who you are, what you love and where you want to go.',
                ),
              ],
              [
                copy(
                  'Добавь достижения',
                  'Жетістіктеріңді қос',
                  'Add your achievements',
                ),
                copy(
                  'Дипломы, проекты, соревнования. Каждая история важна.',
                  'Дипломдар, жобалар, жарыстар. Әрбір тарих маңызды.',
                  'Certificates, projects, competitions. Every story matters.',
                ),
              ],
              [
                copy('Двигайся дальше', 'Әрі қарай дамы', 'Keep moving'),
                copy(
                  'Выбери олимпиаду, наставника или новое направление.',
                  'Олимпиада, тәлімгер немесе жаңа бағыт таңда.',
                  'Find a competition, a mentor or a new direction.',
                ),
              ],
            ].map(([title, body], i) => (
              <li key={title}>
                <span>
                  0{i + 1}
                  <ArrowRight size={19} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="pitch-section pitch-faq" id="faq">
          <div>
            <div className="pitch-section-label">03 / FAQ</div>
            <h2>{copy('Есть вопросы?', 'Сұрақтарың бар ма?', 'Questions?')}</h2>
            <p>
              {copy(
                'Ответы перед первым шагом.',
                'Алғашқы қадамға дейінгі жауаптар.',
                'A few answers before your first step.',
              )}
            </p>
          </div>
          <div className="pitch-faq-items">
            {questions.map(([question, answer], index) => (
              <div key={question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={faq === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setFaq(faq === index ? null : index)}
                  >
                    <span>0{index + 1}</span>
                    {question}
                    {faq === index ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                </h3>
                <div id={`faq-answer-${index}`} hidden={faq !== index}>
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="pitch-final">
          <div className="pitch-section-label">YOUR FUTURE IS YOURS</div>
          <h2>
            {copy(
              'Дальше —\nтолько твой путь.',
              'Әрі қарай —\nсенің жолың.',
              'Your future.\nYour move.',
            )}
          </h2>
          <Link to={destination} className="pitch-button">
            {cta}
            <ArrowUpRight size={21} />
          </Link>
          <Spark />
        </section>
      </main>
      <footer className="pitch-footer">
        <Link to="/" className="pitch-brand">
          <Spark />
          ushqn
        </Link>
        <span>© {new Date().getFullYear()} USHQN</span>
        <a href="#top">{copy('Наверх', 'Жоғары', 'Back to top')} ↑</a>
      </footer>
    </div>
  )
}

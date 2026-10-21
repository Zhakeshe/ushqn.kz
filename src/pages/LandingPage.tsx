import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Trophy,
  Compass,
  Store,
  GraduationCap,
  ArrowUpRight,
  Check,
} from 'lucide-react'
import { AppPageMeta } from '../components/AppPageMeta'
import { useCopy } from '../product/useCopy'
import '../product/pitch.css'

export function LandingPage() {
  const copy = useCopy()
  const { i18n } = useTranslation()
  const features = [
    {
      icon: ShieldCheck,
      n: '01',
      title: copy(
        'Портфолио, которое говорит за тебя',
        'Сен үшін сөйлейтін портфолио',
        'A portfolio that speaks for you',
      ),
      body: copy(
        'Сертификаты, проекты, спорт и творчество в одном профиле. Достижения проходят проверку перед начислением баллов.',
        'Сертификаттар, жобалар, спорт пен өнер бір профильде. Ұпай берілмес бұрын жетістіктер тексеріледі.',
        'Certificates, projects, sports and arts in one profile. Achievements are reviewed before points are awarded.',
      ),
    },
    {
      icon: Trophy,
      n: '02',
      title: copy(
        'Как Codeforces, но для жизни',
        'Өмірге арналған Codeforces',
        'Like Codeforces, for life',
      ),
      body: copy(
        'Развивайся в своём направлении: робототехника, программирование, наука, спорт или волонтёрство. Следи за своим ростом.',
        'Робототехника, бағдарламалау, ғылым, спорт немесе волонтёрлік бағытыңда дамы. Өз өсуіңді бақыла.',
        'Grow in robotics, programming, science, sports or volunteering. Track your progress across disciplines.',
      ),
    },
    {
      icon: GraduationCap,
      n: '03',
      title: copy(
        'Олимпиады в одном месте',
        'Олимпиадалар бір жерде',
        'A place to challenge yourself',
      ),
      body: copy(
        'Находи онлайн-соревнования, решай задания и получай результат. Организаторы создают тесты и видят результаты участников.',
        'Онлайн жарыстарды тауып, тапсырмаларды орында және нәтижеңді көр. Ұйымдастырушылар тест құрып, нәтижелерді қарайды.',
        'Find online competitions, answer questions and get your results. Organizers create tests and review participant scores.',
      ),
    },
    {
      icon: Compass,
      n: '04',
      title: copy(
        'Твой следующий шаг',
        'Сенің келесі қадамың',
        'Find your next step',
      ),
      body: copy(
        'Начни с интересов: базовая профориентация поможет выбрать направления и составить план. AI-наставник — следующий этап.',
        'Қызығушылығыңнан баста: кәсіби бағдар бағыт таңдауға және жоспар құруға көмектеседі. AI-тәлімгер — келесі кезең.',
        'Start with your interests. Career guidance helps you explore directions and make a plan. An AI mentor is the next step.',
      ),
    },
    {
      icon: Store,
      n: '05',
      title: copy(
        'Знания становятся возможностями',
        'Біліміңді мүмкіндікке айналдыр',
        'Turn knowledge into opportunity',
      ),
      body: copy(
        'Предлагай репетиторство, менторство и консультации. Находи людей, у которых можно учиться, и общайся напрямую.',
        'Репетиторлық, тәлімгерлік пен кеңес ұсын. Үйренуге болатын адамдарды тап және тікелей байланыс.',
        'Offer tutoring, mentoring and consultations. Find people to learn from and connect directly.',
      ),
    },
  ]
  return (
    <div className="pitch-site">
      <AppPageMeta
        title={copy(
          'Твои цели. Твой путь.',
          'Сенің мақсатың. Сенің жолың.',
          'Your goals. Your journey.',
        )}
      />
      <a href="#main" className="ushqn-skip-link">
        {copy('К содержимому', 'Мазмұнға өту', 'Skip to content')}
      </a>
      <header className="pitch-header">
        <Link to="/" className="pitch-brand">
          <Sparkles size={26} /> USHQN
        </Link>
        <nav className="pitch-links">
          <a href="#platform">{copy('Платформа', 'Платформа', 'Platform')}</a>
          <a href="#journey">
            {copy('Как это работает', 'Қалай жұмыс істейді', 'How it works')}
          </a>
          <a href="#organizations">
            {copy('Организаторам', 'Ұйымдастырушыларға', 'For organizers')}
          </a>
        </nav>
        <div className="pitch-header-actions">
          <select
            aria-label={copy('Язык', 'Тіл', 'Language')}
            value={i18n.language.split('-')[0]}
            onChange={(e) => void i18n.changeLanguage(e.target.value)}
          >
            <option value="ru">RU</option>
            <option value="kk">KZ</option>
            <option value="en">EN</option>
          </select>
          <Link to="/login">{copy('Войти', 'Кіру', 'Sign in')}</Link>
          <Link className="pitch-button small" to="/register">
            {copy('Начать', 'Бастау', 'Get started')} <ArrowUpRight size={16} />
          </Link>
        </div>
      </header>
      <main id="main">
        <section className="pitch-hero">
          <div className="pitch-hero-copy">
            <span className="pitch-eyebrow">
              <span /> From Spark to Success
            </span>
            <h1>
              {copy('Твои цели.', 'Сенің мақсатың.', 'Your goals.')}
              <br />
              {copy('Твой путь.', 'Сенің жолың.', 'Your journey.')}
              <br />
              <em>{copy('Твой USHQN.', 'Сенің USHQN.', 'Your USHQN.')}</em>
            </h1>
            <p>
              {copy(
                'Твои таланты заслуживают большего, чем папка с дипломами. Собери портфолио, найди своё направление и сделай следующий шаг.',
                'Талантың дипломдар папкасынан да артыққа лайық. Портфолио жина, бағытыңды тап және келесі қадамыңды жаса.',
                'Your talents deserve more than a folder of certificates. Build your portfolio, find your direction and take your next step.',
              )}
            </p>
            <div className="pitch-hero-actions">
              <Link to="/register" className="pitch-button">
                {copy(
                  'Создать портфолио',
                  'Портфолио құру',
                  'Build my portfolio',
                )}{' '}
                <ArrowRight size={18} />
              </Link>
              <a href="#platform" className="pitch-text-link">
                {copy(
                  'Узнать больше',
                  'Толығырақ білу',
                  'Explore the platform',
                )}{' '}
                ↗
              </a>
            </div>
            <div className="pitch-hero-note">
              <Check size={15} />
              {copy(
                'Базовый профиль — бесплатно',
                'Негізгі профиль — тегін',
                'Your core profile is free',
              )}
            </div>
          </div>
          <div
            className="pitch-visual"
            aria-label={copy(
              'Пример портфолио',
              'Портфолио үлгісі',
              'Portfolio example',
            )}
          >
            <div className="pitch-orbit orbit-one" />
            <div className="pitch-orbit orbit-two" />
            <span className="pitch-star">✦</span>
            <div className="pitch-preview">
              <div className="pitch-preview-top">
                <span>USHQN / PORTFOLIO</span>
                <span>{copy('Пример', 'Үлгі', 'Example')}</span>
              </div>
              <div className="pitch-avatar">A</div>
              <h2>{copy('Аружан', 'Аружан', 'Aruzhan')}</h2>
              <p>
                {copy(
                  'Учусь. Создаю. Меняю мир.',
                  'Үйренемін. Жасаймын. Әлемді өзгертемін.',
                  'Learning. Building. Making a difference.',
                )}
              </p>
              <div className="pitch-tags">
                <span>Robotics</span>
                <span>Science</span>
                <span>Volunteering</span>
              </div>
              <div className="pitch-certificate">
                <div className="pitch-medal">
                  <Trophy size={23} />
                </div>
                <div>
                  <strong>FIRST LEGO League</strong>
                  <span>
                    {copy(
                      'Достижение в портфолио',
                      'Портфолиодағы жетістік',
                      'A portfolio achievement',
                    )}
                  </span>
                </div>
                <ShieldCheck size={18} />
              </div>
              <div className="pitch-mini-chart">
                <span style={{ height: '28%' }} />
                <span style={{ height: '40%' }} />
                <span style={{ height: '38%' }} />
                <span style={{ height: '57%' }} />
                <span style={{ height: '67%' }} />
                <span style={{ height: '82%' }} />
                <span style={{ height: '100%' }} />
              </div>
              <div className="pitch-chart-caption">
                {copy(
                  'Каждый шаг имеет значение',
                  'Әр қадам маңызды',
                  'Every step counts',
                )}{' '}
                <ArrowUpRight size={15} />
              </div>
            </div>
            <div className="pitch-floating">
              <Compass size={19} />
              <span>
                {copy(
                  'Твой потенциал — только начало',
                  'Әлеуетің — тек бастамасы',
                  'Your potential is just the beginning',
                )}
              </span>
            </div>
          </div>
        </section>
        <div className="pitch-disciplines">
          <span>
            {copy(
              'Один профиль. Все твои стороны.',
              'Бір профиль. Барлық қырың.',
              'One profile. Every side of you.',
            )}
          </span>
          {['Robotics', 'Programming', 'Science', 'Sports', 'Arts'].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <section className="pitch-section" id="platform">
          <span className="pitch-eyebrow">
            {copy(
              'ПЛАТФОРМА РОСТА',
              'ДАМУ ПЛАТФОРМАСЫ',
              'BUILT FOR YOUR GROWTH',
            )}
          </span>
          <div className="pitch-section-heading">
            <h2>
              {copy(
                'Всё, чтобы найти себя.',
                'Өзіңді табуға қажеттінің бәрі.',
                'Room to become yourself.',
              )}
            </h2>
            <p>
              {copy(
                'От первого достижения до осознанного выбора будущего.',
                'Алғашқы жетістіктен болашақты саналы таңдауға дейін.',
                'From your first achievement to an intentional future.',
              )}
            </p>
          </div>
          <div className="pitch-feature-grid">
            {features.map(({ icon: Icon, n, title, body }) => (
              <article key={n} className={`pitch-feature feature-${n}`}>
                <div className="pitch-feature-top">
                  <Icon size={23} />
                  <span>{n}</span>
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="journey" className="pitch-section pitch-journey">
          <div>
            <span className="pitch-eyebrow">
              {copy('ТВОЙ ПУТЬ', 'СЕНІҢ ЖОЛЫҢ', 'YOUR JOURNEY')}
            </span>
            <h2>
              {copy(
                'Большое начинается с искры.',
                'Үлкен жетістік ұшқыннан басталады.',
                'It all starts with a spark.',
              )}
            </h2>
            <Link to="/register" className="pitch-text-link">
              {copy(
                'Сделать первый шаг',
                'Алғашқы қадамды жасау',
                'Take the first step',
              )}{' '}
              <ArrowRight size={17} />
            </Link>
          </div>
          <ol>
            {[
              [
                copy(
                  'Расскажи о себе',
                  'Өзің туралы айт',
                  'Introduce yourself',
                ),
                copy(
                  'Интересы, школа, цели — основа твоего профиля.',
                  'Қызығушылық, мектеп, мақсат — профиліңнің негізі.',
                  'Your interests, school and goals are your foundation.',
                ),
              ],
              [
                copy(
                  'Собери свои достижения',
                  'Жетістіктеріңді жина',
                  'Bring your achievements together',
                ),
                copy(
                  'Добавь проекты и дипломы, отправь достижения на проверку.',
                  'Жобалар мен дипломдарды қосып, жетістіктерді тексеруге жібер.',
                  'Add projects and certificates, then submit achievements for review.',
                ),
              ],
              [
                copy(
                  'Выбери следующий вызов',
                  'Келесі сын-қатерді таңда',
                  'Choose your next challenge',
                ),
                copy(
                  'Олимпиада, новое направление или первый ученик — решаешь ты.',
                  'Олимпиада, жаңа бағыт немесе алғашқы оқушы — өзің шешесің.',
                  'A competition, a new direction or your first student. It is your choice.',
                ),
              ],
            ].map(([title, desc], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section id="organizations" className="pitch-organizations">
          <div>
            <span className="pitch-eyebrow">USHQN FOR ORGANIZATIONS</span>
            <h2>
              {copy(
                'Помогайте талантам расти.',
                'Таланттардың өсуіне көмектесіңіз.',
                'Help talent grow.',
              )}
            </h2>
            <p>
              {copy(
                'Школам и организаторам: проводите тестовые олимпиады и отслеживайте результаты. Создание соревнований доступно уполномоченным сотрудникам.',
                'Мектептер мен ұйымдастырушыларға: тест олимпиадаларын өткізіп, нәтижелерді бақылаңыз. Жарысты уәкілетті қызметкерлер құрады.',
                'For schools and organizers: run test-based olympiads and review results. Authorized staff can create competitions.',
              )}
            </p>
            <Link to="/login" className="pitch-button">
              {copy(
                'Войти как организатор',
                'Ұйымдастырушы ретінде кіру',
                'Organizer sign in',
              )}{' '}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="pitch-org-list">
            {[
              copy(
                'Онлайн-тесты с ограничением времени',
                'Уақыт шектеуі бар онлайн тесттер',
                'Timed online tests',
              ),
              copy(
                'Автоматическая проверка ответов',
                'Жауаптарды автоматты тексеру',
                'Automatic answer checking',
              ),
              copy(
                'Результаты участников',
                'Қатысушылар нәтижелері',
                'Participant results',
              ),
            ].map((x) => (
              <div key={x}>
                <Check size={19} />
                {x}
              </div>
            ))}
          </div>
        </section>
        <section className="pitch-final">
          <Sparkles size={32} />
          <h2>
            {copy(
              'Твоё будущее начинается с тебя.',
              'Болашағың өзіңнен басталады.',
              'Your future starts with you.',
            )}
          </h2>
          <Link to="/register" className="pitch-button">
            {copy('Присоединиться к USHQN', 'USHQN-ға қосылу', 'Join USHQN')}{' '}
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
      <footer className="pitch-footer">
        <Link to="/" className="pitch-brand">
          USHQN ✦
        </Link>
        <span>From Spark to Success</span>
        <span>© {new Date().getFullYear()} USHQN</span>
      </footer>
    </div>
  )
}

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Bell,
  Check,
  ChevronDown,
  Circle,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  Tag,
} from "lucide-react";

import api from "./services/api";
import {
  login,
  logout,
  register,
  saveSession,
  type LoginResult,
} from "./services/auth";
import "./App.css";

type Language = "pt" | "en";
type Theme = "light" | "dark";
type Task = {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  category?: { name: string } | null;
};
type DashboardData = {
  summary: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    dueToday: number;
  };
};
type ApiResponse<T> = { success: true; data: T; meta?: { totalItems: number } };
type FormValues = { name?: string; email: string; password: string };

const copy = {
  pt: {
    today: "Hoje",
    tasks: "Tarefas",
    categories: "Categorias",
    settings: "Configurações",
    subtitle: "Veja o que importa para o seu dia.",
    newTask: "Nova tarefa",
    search: "Buscar tarefas...",
    overview: "Visão geral",
    total: "Total",
    pending: "Pendentes",
    completed: "Concluídas",
    todayTasks: "Para hoje",
    progress: "Progresso",
    done: "concluídas",
    upcoming: "Próximas tarefas",
    viewAll: "Ver todas",
    notifications: "Notificações",
    noNotifications: "Você está em dia.",
    login: "Entrar",
    createAccount: "Criar conta",
    email: "E-mail",
    password: "Senha",
    name: "Nome",
    authTitle: "Organize o que importa.",
    authText: "Entre na sua conta para continuar no Taskly.",
    noAccount: "Ainda não tem uma conta?",
    hasAccount: "Já tem uma conta?",
    welcome: "Bem-vindo, ",
    loading: "Carregando seu espaço...",
    logout: "Sair",
    empty: "Nenhuma tarefa encontrada.",
  },
  en: {
    today: "Today",
    tasks: "Tasks",
    categories: "Categories",
    settings: "Settings",
    subtitle: "See what matters for your day.",
    newTask: "New task",
    search: "Search tasks...",
    overview: "Overview",
    total: "Total",
    pending: "Pending",
    completed: "Completed",
    todayTasks: "Due today",
    progress: "Progress",
    done: "completed",
    upcoming: "Upcoming tasks",
    viewAll: "View all",
    notifications: "Notifications",
    noNotifications: "You are all caught up.",
    login: "Sign in",
    createAccount: "Create account",
    email: "Email",
    password: "Password",
    name: "Name",
    authTitle: "Organize what matters.",
    authText: "Sign in to continue to Taskly.",
    noAccount: "Do not have an account yet?",
    hasAccount: "Already have an account?",
    welcome: "Welcome, ",
    loading: "Loading your space...",
    logout: "Log out",
    empty: "No tasks found.",
  },
} as const;

const formSchema = z.object({
  name: z.string().min(2, "Informe ao menos 2 caracteres.").optional(),
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

function getSystemTheme(): Theme {
  // Antes de o usuário escolher um tema no aplicativo, respeitamos o tema do sistema.
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function formatDueDate(date: string | null, language: Language) {
  if (!date) return language === "pt" ? "Sem prazo" : "No due date";
  return new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

function App() {
  const [language, setLanguage] = useState<Language>(() =>
    localStorage.getItem("taskly_language") === "en" ? "en" : "pt",
  );
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("taskly_theme") as Theme) || getSystemTheme(),
  );
  const [session, setSession] = useState<LoginResult | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("taskly_theme", theme);
  }, [theme]);

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    localStorage.setItem("taskly_language", nextLanguage);
  }

  function handleAuthenticated(nextSession: LoginResult) {
    // A saudação é mostrada somente depois de uma autenticação bem-sucedida.
    saveSession(nextSession);
    setSession(nextSession);
    setShowWelcome(true);
  }

  function handleLogout() {
    void logout();
    setSession(null);
  }

  return (
    <AnimatePresence mode="wait">
      {showWelcome && session ? (
        <WelcomeScreen
          key="welcome"
          name={session.user.name}
          language={language}
          onComplete={() => setShowWelcome(false)}
        />
      ) : session ? (
        <Dashboard
          key="dashboard"
          session={session}
          language={language}
          theme={theme}
          onTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          onLanguage={changeLanguage}
          onLogout={handleLogout}
        />
      ) : (
        <AuthScreen
          key="auth"
          language={language}
          onLanguage={changeLanguage}
          onAuthenticated={handleAuthenticated}
        />
      )}
    </AnimatePresence>
  );
}

function AuthScreen({
  language,
  onLanguage,
  onAuthenticated,
}: {
  language: Language;
  onLanguage: (value: Language) => void;
  onAuthenticated: (session: LoginResult) => void;
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = copy[language];
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(formSchema) });

  async function submit(values: FormValues) {
    try {
      setError("");
      setIsSubmitting(true);
      const session = isRegister
        ? await register(values.name || "", values.email, values.password)
        : await login(values.email, values.password);
      onAuthenticated(session);
    } catch (requestError: unknown) {
      const response = requestError as {
        response?: { data?: { error?: { message?: string } } };
      };
      setError(
        response.response?.data?.error?.message ||
          "Não foi possível autenticar. Verifique se o backend está em execução.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.main
      className="auth-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="auth-language">
        <button
          className={language === "pt" ? "selected" : ""}
          onClick={() => onLanguage("pt")}
        >
          PT
        </button>
        <button
          className={language === "en" ? "selected" : ""}
          onClick={() => onLanguage("en")}
        >
          EN
        </button>
      </div>
      <section className="auth-card">
        <div className="auth-brand">T</div>
        <p className="auth-kicker">TASKLY</p>
        <h1>{t.authTitle}</h1>
        <p className="auth-description">{t.authText}</p>
        <form onSubmit={handleSubmit(submit)} noValidate>
          {isRegister && (
            <label>
              {t.name}
              <input
                {...registerField("name")}
                autoComplete="name"
                placeholder="José Lucas"
              />
              {errors.name && <small>{errors.name.message}</small>}
            </label>
          )}
          <label>
            {t.email}
            <input
              {...registerField("email")}
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
            />
            {errors.email && <small>{errors.email.message}</small>}
          </label>
          <label>
            {t.password}
            <input
              {...registerField("password")}
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="••••••••"
            />
            {errors.password && <small>{errors.password.message}</small>}
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "..." : isRegister ? t.createAccount : t.login}
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? t.hasAccount : t.noAccount}{" "}
          <button
            onClick={() => {
              setError("");
              setIsRegister(!isRegister);
            }}
          >
            {isRegister ? t.login : t.createAccount}
          </button>
        </p>
      </section>
    </motion.main>
  );
}

function WelcomeScreen({
  name,
  language,
  onComplete,
}: {
  name: string;
  language: Language;
  onComplete: () => void;
}) {
  const [text, setText] = useState("");
  const completeText = `${copy[language].welcome}${name}.`;
  useEffect(() => {
    // Escreve a mensagem gradualmente antes de liberar a entrada no dashboard.
    let position = 0;
    const timer = window.setInterval(() => {
      position += 1;
      setText(completeText.slice(0, position));
      if (position === completeText.length) window.setTimeout(onComplete, 850);
    }, 52);
    return () => window.clearInterval(timer);
  }, [completeText, onComplete]);
  return (
    <motion.main
      className="welcome-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <span className="brand-mark">T</span>
      <h1>
        {text}
        <i />
      </h1>
      <p>{copy[language].loading}</p>
    </motion.main>
  );
}

function Dashboard({
  session,
  language,
  theme,
  onTheme,
  onLanguage,
  onLogout,
}: {
  session: LoginResult;
  language: Language;
  theme: Theme;
  onTheme: () => void;
  onLanguage: (value: Language) => void;
  onLogout: () => void;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<DashboardData["summary"]>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    dueToday: 0,
  });
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const t = copy[language];
  useEffect(() => {
    void loadDashboard();
  }, []);
  // Dashboard e tarefas são consultados juntos para manter os indicadores consistentes.
  async function loadDashboard() {
    try {
      setError("");
      const [tasksResponse, dashboardResponse] = await Promise.all([
        api.get<ApiResponse<Task[]>>("/tasks", { params: { limit: 5 } }),
        api.get<ApiResponse<DashboardData>>("/dashboard"),
      ]);
      setTasks(tasksResponse.data.data);
      setSummary(dashboardResponse.data.data.summary);
    } catch {
      setError(
        "Não foi possível carregar as tarefas. Confirme se o backend local está ativo.",
      );
    }
  }
  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, tasks],
  );
  const progress = summary.total
    ? Math.round((summary.completed / summary.total) * 100)
    : 0;
  async function toggleTask(task: Task) {
    try {
      await api.put(`/tasks/${task.id}`, { completed: !task.completed });
      await loadDashboard();
    } catch {
      setError("Não foi possível atualizar a tarefa.");
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top">
          <span className="brand-mark">T</span>
          <span>taskly</span>
        </a>
        <nav className="sidebar-nav">
          <a className="nav-link active" href="#top">
            <LayoutDashboard size={18} />
            {t.today}
          </a>
          <a className="nav-link" href="#tasks">
            <ListTodo size={18} />
            {t.tasks}
            <span>{summary.total}</span>
          </a>
          <a className="nav-link" href="#categories">
            <Tag size={18} />
            {t.categories}
          </a>
        </nav>
        <div className="sidebar-bottom">
          <a className="nav-link" href="#settings">
            <Settings size={18} />
            {t.settings}
          </a>
          <button className="nav-link logout" onClick={onLogout}>
            <LogOut size={18} />
            {t.logout}
          </button>
          <div className="profile-card">
            <span className="avatar">
              {session.user.name.charAt(0).toUpperCase()}
            </span>
            <span>
              <strong>{session.user.name}</strong>
              <small>{session.user.email}</small>
            </span>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>
      <section className="content" id="top">
        <header className="topbar">
          <label className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.search}
            />
          </label>
          <div className="topbar-actions">
            <div className="language-switch">
              <button
                className={language === "pt" ? "selected" : ""}
                onClick={() => onLanguage("pt")}
              >
                PT
              </button>
              <button
                className={language === "en" ? "selected" : ""}
                onClick={() => onLanguage("en")}
              >
                EN
              </button>
            </div>
            <button
              className="icon-button"
              onClick={onTheme}
              aria-label="Alternar tema"
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>
            <button
              className="icon-button notification-button"
              aria-label={t.notifications}
            >
              <Bell size={19} />
              <i />
            </button>
          </div>
        </header>
        <div className="page-header">
          <div>
            <p className="eyebrow">
              {new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(new Date())}
            </p>
            <h1>{t.today}.</h1>
            <p>{t.subtitle}</p>
          </div>
          <button
            className="primary-button"
            onClick={() =>
              window.alert(
                "A criação de tarefas será a próxima tela conectada à API.",
              )
            }
          >
            <Plus size={19} />
            {t.newTask}
          </button>
        </div>
        <section className="overview">
          <h2>{t.overview}</h2>
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-icon">
                <ListTodo size={19} />
              </span>
              <span>{t.total}</span>
              <strong>{summary.total}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-icon muted">
                <Circle size={19} />
              </span>
              <span>{t.pending}</span>
              <strong>{summary.pending}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-icon success">
                <Check size={19} />
              </span>
              <span>{t.completed}</span>
              <strong>{summary.completed}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-icon accent">
                <Bell size={19} />
              </span>
              <span>{t.todayTasks}</span>
              <strong>{summary.dueToday}</strong>
            </article>
          </div>
        </section>
        <div className="dashboard-grid">
          <section className="panel task-panel" id="tasks">
            <div className="panel-heading">
              <div>
                <h2>{t.upcoming}</h2>
                <p>
                  {visibleTasks.length} {t.tasks.toLowerCase()}
                </p>
              </div>
              <button className="text-button">{t.viewAll}</button>
            </div>
            {error && <p className="dashboard-error">{error}</p>}
            <div className="task-list">
              {visibleTasks.length ? (
                visibleTasks.map((task) => (
                  <motion.article
                    className={`task-row ${task.completed ? "is-complete" : ""}`}
                    key={task.id}
                    layout
                  >
                    <button
                      className="check-button"
                      onClick={() => void toggleTask(task)}
                      aria-label="Alterar status"
                    >
                      {task.completed && <Check size={14} />}
                    </button>
                    <div>
                      <strong>{task.title}</strong>
                      <p>
                        <span className="category-dot" />
                        {task.category?.name || "Sem categoria"}
                      </p>
                    </div>
                    <time>{formatDueDate(task.dueDate, language)}</time>
                  </motion.article>
                ))
              ) : (
                <p className="empty-state">{t.empty}</p>
              )}
            </div>
          </section>
          <section className="panel progress-panel">
            <div className="panel-heading">
              <div>
                <h2>{t.progress}</h2>
                <p>
                  {summary.completed} de {summary.total} {t.done}
                </p>
              </div>
              <strong className="progress-value">{progress}%</strong>
            </div>
            <div className="progress-track">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.7 }}
              />
            </div>
            <div className="progress-note">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>
            <div className="tip">
              <span>✦</span>
              <p>Pequenos avanços todos os dias criam grandes resultados.</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default App;

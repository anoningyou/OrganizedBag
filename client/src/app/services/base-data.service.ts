import { Observable } from "rxjs";
import { AccountService } from "./account.service";

export abstract class BaseDataService {
  unsinchronised = false;
  userId: string | undefined | null;

  constructor(protected accountService: AccountService) {
    
  }

  protected abstract loadAll(): void;
  protected abstract mergeData(): void;
  protected abstract cleanData(): void;

  protected init() {
    this.accountService.currentUser$.subscribe((user) => {
      if ((this.userId ?? '') !== (user?.id ?? '')) {
        if (!!this.userId) 
            this.cleanData();
        else 
            this.mergeData();

        this.userId = user?.id;
      }
    });
    this.loadAll();
  }

  protected execAuthorisedHttp<T>(observable: Observable<T>, callback?: ((value: T) => void ) | undefined) {
    if (!!this.userId) {
      observable.subscribe({
        next: callback,
        error: error => {
          console.error(error);
          this.unsinchronised = true;
        }
      });
      return true;
    }
    else 
      return false;
  }
}